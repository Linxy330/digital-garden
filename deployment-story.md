---
title: 在云端种下一座花园
date: 2026-02-08
tags:
  - Life
  - Tech
  - GCP
  - VitePress
---

# 在云端种下一座花园

Google Cloud 上有免费的服务器可以白嫖，思来想去，不如建一个个人网站，写写废文。

![Google Cloud 免费服务器额度](/images/google-cloud-free-server.png)

最近放寒假，有时间折腾，花了亿点点时间，终于把这个网站建好了。

## 前戏

之前用过 WordPress，用的是 1Panel 面板直接部署，这次想换换口味。问了一下 Gemini，它给我推荐了 VitePress，欣然。

白嫖的配置：2 个 vCPU，1 GB 内存，30 GB 硬盘，丐中丐。

Gemini 说这个配置就别搞太多了，最后给了一套方案：
在本地把 Markdown 文件写好，然后 push 上 GitHub，再用 GitHub Actions 自动部署到服务器上，服务器只起接收和展示的作用，把耗资源的活都扔给 GitHub。（超极倪哥）

开干！

## 搭建过程

### 初始化项目

```bash
# 1. 创建文件夹
mkdir my-digital-garden
cd my-digital-garden

# 2. 初始化 package.json
npm init -y

# 3. 安装 VitePress
npm add -D vitepress

# 4. 启动安装向导
npx vitepress init
```

然后根据需要配置。

### 试运行

```bash
npm run docs:dev
```

打开浏览器访问 http://localhost:5173 就可以看到效果了。

### 建立本地仓库

```bash
# 1. 初始化仓库
git init

# 2. 创建忽略文件 (防止把垃圾文件传上去)
New-Item .gitignore -Type File -Value "node_modules`n.DS_Store`ndist`ncache`n.idea"

# 3. 把所有文件加入暂存区
git add .

# 4. 提交第一次存档
git commit -m "Initial commit: My Digital Garden starts here"
```

### 创建 SSH Key

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ./deploy_key
```

按两次回车确认。

成功后，项目文件夹会多出两个文件：

```text
.
├── deploy_key      (私钥)
└── deploy_key.pub  (公钥)
```

这两个文件要保管好（不过丢了也没关系，重新配一次就好）。

在 .gitignore 文件中添加：

```text
deploy_key
```

这样私钥就不会传到 GitHub 上了。

### 把公钥放上服务器

用文本编辑器打开 deploy_key.pub 文件，复制里面的**所有**内容。打开服务器的 SSH，运行：

```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

关闭 SSH，在 Google Cloud 修改虚拟机实例页面，找到安全与访问权限 -> SSH 密钥，点击添加项，把刚刚复制的公钥粘贴进去，将最后的 github-actions-deploy 删掉，改成 GCP 用户名，确认。

![SSH 设置](/images/SSH-setting.png)

### 把私钥放上 GitHub

用文本编辑器打开 deploy_key 文件，复制里面的**所有**内容。

去 GitHub 创建一个公开仓库。
![创建仓库](/images/create-repository.png)

在本机运行：
```bash
git branch -M main
# 注意：下面这行里的 <你的GitHub用户名> 要换成真实的
git remote add origin https://github.com/<你的GitHub用户名>/digital-garden.git
git push -u origin main
```

push 上去之后，点击仓库顶部的 Settings，在左侧边栏找 Secrets and variables -> Actions，点击 New repository secret。

```text
Name: SSH_PRIVATE_KEY
Secret: 刚才复制的私钥
```

点击 Add secret 确认。

再加另外两个：

```text
Name: HOST
Secret: 服务器外部 IP（如果是动态的就改为静态的）
```

```text
Name: USERNAME
Secret: 用户名 (可以在 SSH 窗口输 whoami 查看)
```

### 配置自动化

实现自动化之后，以后只要 git push，代码就会自动放到服务器里。

在项目根目录下新建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to Google Cloud

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm

      - name: Build
        run: |
          npm ci
          npm run docs:build

      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@main
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: "-rlgoDzvc -i"
          SOURCE: ".vitepress/dist/"
          REMOTE_HOST: ${{ secrets.HOST }}
          REMOTE_USER: ${{ secrets.USERNAME }}
          TARGET: "/var/www/html/digital-garden"
          EXCLUDE: "/dist/, /node_modules/"
```

防止 GitHub 推送时没权限写入：

```bash
sudo mkdir -p /var/www/html/digital-garden
sudo chown -R $USER:$USER /var/www/html/digital-garden
```

提交代码：

```bash
git add .
git commit -m "Add deploy pipeline"
git push
```

这时候去 GitHub 的 Actions 页面，就可以看到倪哥工作了。

### 配置 Nginx

最后需要配置 Nginx 将编译好的网页展示出来：

```bash
sudo nano /etc/nginx/sites-available/my-garden
```

写入配置：

```nginx
server {
    listen 80;
    server_name kennylin.top www.kennylin.top; # 这里放域名

    # 指向 GitHub Action 推送过来的目录
    root /var/www/html/digital-garden;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 开启 gzip 压缩，让网页加载更快
    gzip on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

启用配置并重启 Nginx：

```bash
# 建立软链接 (激活配置)
sudo ln -s /etc/nginx/sites-available/kennylin.top /etc/nginx/sites-enabled/

# 删掉默认的 Welcome 页面 (避免冲突)
sudo rm /etc/nginx/sites-enabled/default

# 检查有没有写错，如果显示 OK 就重启
sudo nginx -t && sudo systemctl reload nginx
```

### 配置域名

我用的是 Cloudflare。

在 Cloudflare 添加一条 A 记录，指向服务器的外部 IP。再在 SSL/TLS 设置里选 "Flexible"。

这样不用在服务器上装证书，访问网站时也能用 HTTPS。

## 最后

在本地写好 markdown 文件，再 push 到 GitHub，等一段时间后刷新网页就可以看到更改了。