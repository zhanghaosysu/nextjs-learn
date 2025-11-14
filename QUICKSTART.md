# 快速开始指南

欢迎使用 Next.js 学习项目！本指南将帮助你快速上手。

## 🚀 第一步：安装依赖

```bash
npm install
```

## 🏃 第二步：启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📖 第三步：探索项目

### 1. 首页 (`/`)

- 项目概览
- 导航到各个示例页面

### 2. API 示例 (`/api-demo`)

- 学习如何调用 API 路由
- 尝试 GET 和 POST 请求

### 3. 服务端组件 (`/server-demo`)

- 了解服务端组件的特性
- 查看服务端数据获取

### 4. 客户端组件 (`/client-demo`)

- 学习客户端交互
- 使用 React Hooks

### 5. 用户列表 (`/users`)

- 服务端数据获取示例

## 🔍 查看代码

### API 路由

- `app/api/hello/route.ts` - 简单的 GET 请求
- `app/api/user/route.ts` - 带参数的 GET 请求
- `app/api/data/route.ts` - POST 请求处理

### 页面组件

- `app/page.tsx` - 首页
- `app/api-demo/page.tsx` - API 使用示例
- `app/server-demo/page.tsx` - 服务端组件
- `app/client-demo/page.tsx` - 客户端组件
- `app/users/page.tsx` - 数据获取示例

## 📚 学习路径

1. **基础概念**

   - 阅读 `README.md` 了解项目结构
   - 查看 `PRINCIPLES.md` 理解工作原理

2. **实践操作**

   - 修改页面内容，观察变化
   - 创建新的 API 路由
   - 添加新的页面

3. **部署**
   - 阅读 `DEPLOYMENT.md` 了解部署方法
   - 尝试部署到 Vercel（最简单）

## 🛠️ 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 💡 下一步

1. 修改首页内容，添加你自己的信息
2. 创建一个新的 API 端点
3. 添加一个使用该 API 的页面
4. 尝试部署到 Vercel

## ❓ 遇到问题？

- 查看 `README.md` 中的常见问题
- 查看 Next.js 官方文档：https://nextjs.org/docs
- 检查控制台错误信息

祝你学习愉快！🎉
