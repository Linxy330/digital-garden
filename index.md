---
layout: home

hero:
  name: 
  text: 
  tagline: 



---

<div class="post-list">
  <div class="post-header">📅 最近更新</div>
  
  <a href="/deployment-story" class="post-item">
    <div class="post-content">
      <div class="post-title">在云端种下一座花园</div>
      <div class="post-desc">我的个人网站搭建记</div>
    </div>
    <div class="post-date">2026-02-08</div>
  </a>

  </div>

<style>
.post-list {
  max-width: 960px;
  margin: 40px auto;
  padding: 0 24px;
}
.post-header {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 10px;
}
.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 12px;
  background-color: var(--vp-c-bg-soft); /* 跟随主题色的柔和背景 */
  border-radius: 12px;
  text-decoration: none !important; /* 去掉下划线 */
  transition: all 0.3s ease;
  border: 1px solid transparent;
}
.post-item:hover {
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-2px); /* 悬停时微微上浮 */
  border-color: var(--vp-c-brand); /* 悬停时边框变色 */
}
.post-content {
  flex: 1;
  margin-right: 20px;
}
.post-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}
.post-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 只显示一行，多余省略 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-date {
  font-size: 14px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  font-family: var(--vp-font-family-mono);
}
</style>

<style>
/* 居中 Hero 区域文本 */
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
}
.VPHero .container {
  display: flex !important;
  flex-direction: column;
  align-items: center !important;
  text-align: center !important;
}
.VPHero .main {
  width: 100% !important;
  max-width: 800px !important;
  margin: 0 auto !important;
}
.VPHero .name,
.VPHero .text,
.VPHero .tagline {
  margin-left: auto !important;
  margin-right: auto !important;
  text-align: center !important;
}
</style>