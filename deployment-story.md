---
title: 在云端种下一座花园：我的个人网站搭建记
date: 2026-02-08
tags:
  - Life
  - Tech
  - GCP
  - VitePress
---

# 在云端种下一座花园：我的个人网站搭建记

Google Cloud 上有免费的服务器可以白嫖，思来想去，不如建一个个人网站，写写废文。

![Google Cloud 免费服务器额度](/images/google-cloud-free-server.png)

最近放寒假，有时间折腾，花了亿点点时间，走了亿点点弯路，终于把这个网站建好了。

## 搭建过程

之前用过 WordPress，用的是 1Panel 面板直接部署，这次想换换口味，直接对着终端敲。问了一下 Gemini，它给我推荐了 VitePress，欣然。

本来以为有着 Gemini 的加持，不轻轻松松吗，结果开始之后才发现我想错了。

### 前戏

白嫖的配置：2 个 vCPU，1 GB 内存，30 GB 硬盘，丐中丐。

Gemini 说这个配置就别搞太多了，最后给了一套方案：

::: tip 方案
在本地把 Markdown 文件写好，然后 push 上 GitHub，再用 GitHub Action 自动部署到服务器上，服务器只起接收和展示的作用，把耗资源的活都扔给 GitHub。（超极倪哥）
:::

开干！

### 本地环境搭建

#### 初始化项目

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

#### 试运行

```bash
npm run docs:dev
```

打开浏览器访问 http://localhost:5173 就可以看到效果了。

#### 建立本地仓库

```bash
# 1. 初始化仓库
git init

# 2. 创建忽略文件 (防止把垃圾文件传上去)
# 在 PowerShell 里输入这一行命令创建 .gitignore 文件：
New-Item .gitignore -Type File -Value "node_modules`n.DS_Store`ndist`ncache`n.idea"

# 3. 把所有文件加入暂存区
git add .

# 4. 提交第一次存档
git commit -m "Initial commit: My Digital Garden starts here"
```

#### 创建SSH Key

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

::: danger 提示
这两个文件要保管好（不过丢了也没关系，重新配一次就好）。
:::

在 .gitignore 文件中添加：

```text
deploy_key
```

::: warning 注意
这样私钥就不会传到 GitHub 上了。
:::

#### 把公钥放上服务器（开始踩坑）

按照 Gemini 的指示：

用文本编辑器打开 deploy_key.pub 文件，复制里面的**所有**内容。打开服务器的 SSH，运行：

```bash
# 1. 创建存放钥匙的目录 (如果已有则忽略)
mkdir -p ~/.ssh

# 2. 用编辑器打开认证文件
nano ~/.ssh/authorized_keys
```

粘贴，之后按 Ctrl + O 和 Enter (保存)，再按 Ctrl + X (退出)。

设置权限：

```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

> **注意**：权限设置非常关键，如果权限太开放，SSH 会拒绝连接。

#### 把私钥放上 GitHub

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
Secret: GCP 外部 IP（如果是动态的就在 GCP 上改为静态的）
```

```text
Name: USERNAME
Secret: GCP 用户名 (可以在 GCP 的 SSH 窗口输 whoami 查看)
```

---

且听下回分解