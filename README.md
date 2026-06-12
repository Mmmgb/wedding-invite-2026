# 🎊 婚礼邀请函 - 静态部署版

这是 **王老爷子 ❤️ 赵大娘** 的婚礼邀请函，可免费部署到各大平台。

---

## 🚀 免费部署方法（三选一）

### 方法一：Vercel（⭐推荐 · 最简单）

1. 访问 https://vercel.com ，用 GitHub 账号登录
2. 把这个 `static-deploy` 文件夹上传到 GitHub 仓库
3. 在 Vercel 点击 "New Project" → 导入你的仓库
4. **无需任何配置**，直接点击 Deploy
5. 获得网址：`https://你的项目名.vercel.app`

### 方法二：GitHub Pages

1. 访问 https://github.com ，注册/登录
2. 创建新仓库 → 上传 `static-deploy` 文件夹里的所有文件
3. 进入 Settings → Pages → Source 选择 `main` 分支 → Save
4. 等待1-2分钟，获得网址：`https://你的用户名.github.io/仓库名`

### 方法三：Netlify

1. 访问 https://netlify.com ，注册账号
2. 把 `static-deploy` 文件夹**直接拖拽**到 Netlify 页面
3. 自动部署，获得网址

---

## 📱 如何分享到微信朋友圈

1. **先部署** → 获得你的邀请函网址（比如 `https://xxx.vercel.app`）
2. **打开** `poster.html` 海报生成页面
3. **输入**你的邀请函网址 → 点击"生成QR码"
4. **点击**"保存海报图片" → 得到一张精美的婚礼海报图片
5. **发朋友圈** → 选择这张海报图片发布
6. 好友在朋友圈**长按识别二维码** → 直接进入你的邀请函 ✅

> 💡 **为什么发图片而不是发链接？**  
> 微信对外部链接会显示"访问网址"安全提示页。但发图片+二维码，好友扫码可以直接打开，没有任何拦截。

---

## 📋 查看宾客回复

提交的表单数据保存在浏览器的 localStorage 中。

在邀请函页面按 **F12** → Console，输入以下命令查看：
```javascript
JSON.parse(localStorage.getItem('wedding_guests') || '[]')
```

（如果部署了Spring Boot后端，数据会自动存入数据库）

---

## ⚠️ 注意事项

- 音乐文件较大（约12MB），GitHub Pages 完全支持，Netlify 免费版限制100MB
- 建议使用 **Vercel** 或 **GitHub Pages**
- 修改婚礼日期/地点/名字 → 编辑 `index.html`
