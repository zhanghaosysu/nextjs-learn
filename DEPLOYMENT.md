# Next.js 部署指南

本指南介绍如何部署 Next.js 应用到不同的平台。

## 🚀 Vercel 部署（最简单，推荐）

Vercel 是 Next.js 的创建者提供的平台，提供最佳体验。

### 步骤

1. **准备代码**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **部署到 Vercel**

   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 登录
   - 点击 "New Project"
   - 导入你的仓库
   - 点击 "Deploy"

3. **自动部署**
   - 每次推送到主分支会自动部署
   - 每个 PR 会创建预览部署
   - 部署完成后会获得一个 URL

### 环境变量

在 Vercel 项目设置中添加环境变量：

- 开发环境变量：用于预览部署
- 生产环境变量：用于生产部署

### 优势

- ✅ 零配置，自动优化
- ✅ 全球 CDN，快速访问
- ✅ 自动 HTTPS
- ✅ 预览部署（每个 PR）
- ✅ 分析工具
- ✅ 免费套餐可用

## 🐳 Docker 部署

### 1. 更新 next.config.js

```js
const nextConfig = {
  output: 'standalone', // 启用独立输出模式
};
```

### 2. 构建 Docker 镜像

```bash
docker build -t nextjs-learn .
```

### 3. 运行容器

```bash
docker run -p 3000:3000 nextjs-learn
```

### 4. 使用 Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  nextjs:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

运行：

```bash
docker-compose up -d
```

## ☁️ 云平台部署

### Railway

1. 在 [Railway](https://railway.app) 创建项目
2. 连接 GitHub 仓库
3. 自动检测并部署

### Netlify

1. 在 [Netlify](https://netlify.com) 创建项目
2. 连接 Git 仓库
3. 构建命令：`npm run build`
4. 发布目录：`.next`

### AWS Amplify

1. 在 AWS Amplify 控制台创建应用
2. 连接 Git 仓库
3. 自动检测 Next.js 并配置

### DigitalOcean App Platform

1. 创建新应用
2. 连接 GitHub 仓库
3. 选择 Node.js 环境
4. 构建命令：`npm run build`
5. 运行命令：`npm start`

## 🖥️ 自托管服务器部署

### 使用 PM2

1. **在服务器上安装 Node.js**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **克隆项目**

   ```bash
   git clone <your-repo-url>
   cd nextjs-learn
   npm install
   ```

3. **构建项目**

   ```bash
   npm run build
   ```

4. **安装 PM2**

   ```bash
   npm install -g pm2
   ```

5. **启动应用**

   ```bash
   pm2 start npm --name "nextjs-learn" -- start
   ```

6. **设置开机自启**
   ```bash
   pm2 startup
   pm2 save
   ```

### 使用 Nginx 反向代理

1. **安装 Nginx**

   ```bash
   sudo apt-get install nginx
   ```

2. **配置 Nginx**
   创建 `/etc/nginx/sites-available/nextjs`：

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **启用配置**

   ```bash
   sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **配置 SSL（使用 Let's Encrypt）**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 📊 部署检查清单

- [ ] 环境变量已配置
- [ ] 构建成功（`npm run build`）
- [ ] 生产环境测试通过
- [ ] 数据库连接正常（如适用）
- [ ] API 路由正常工作
- [ ] 静态资源加载正常
- [ ] SEO 元数据已设置
- [ ] 错误监控已配置
- [ ] 性能监控已配置

## 🔍 常见部署问题

### 问题 1: 构建失败

**解决方案：**

- 检查 Node.js 版本（需要 18+）
- 检查依赖是否正确安装
- 查看构建日志中的错误信息

### 问题 2: API 路由 404

**解决方案：**

- 确保使用 `app/api` 目录结构
- 检查路由文件命名（`route.ts`）
- 确保导出了正确的 HTTP 方法

### 问题 3: 环境变量未生效

**解决方案：**

- 客户端变量需要 `NEXT_PUBLIC_` 前缀
- 服务端变量不需要前缀
- 在部署平台正确配置环境变量

### 问题 4: 静态资源 404

**解决方案：**

- 确保文件在 `public` 目录
- 检查文件路径大小写
- 清除 `.next` 缓存重新构建

## 📈 性能优化

1. **启用压缩**

   - Vercel/Netlify 自动启用
   - 自托管需要配置 Nginx gzip

2. **CDN 配置**

   - 使用 Vercel/Netlify 的全球 CDN
   - 或配置 Cloudflare CDN

3. **缓存策略**

   - 静态资源长期缓存
   - API 响应适当缓存

4. **监控和分析**
   - 使用 Vercel Analytics
   - 或集成 Google Analytics
   - 错误监控（Sentry）

## 🎯 推荐部署方案

- **个人项目/学习项目**：Vercel（免费，简单）
- **小型团队**：Vercel 或 Netlify
- **企业项目**：Vercel Pro 或自托管
- **需要更多控制**：Docker + 云服务器
