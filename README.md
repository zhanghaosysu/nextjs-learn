# Next.js 全栈开发学习项目

这是一个 Next.js 学习项目，展示了 Next.js 的核心概念、全栈开发能力和部署方法。

## 📚 项目结构

```
nextjs-learn/
├── app/                    # App Router 目录（Next.js 13+）
│   ├── api/               # API 路由（后端）
│   │   ├── hello/         # GET 请求示例
│   │   ├── user/          # 带参数的 GET 请求
│   │   └── data/          # POST 请求示例
│   ├── api-demo/          # API 使用示例页面
│   ├── server-demo/       # 服务端组件示例
│   ├── client-demo/       # 客户端组件示例
│   ├── users/             # 数据获取示例
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── public/                # 静态资源
├── next.config.js         # Next.js 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看项目。

### 3. 构建生产版本

```bash
npm run build
```

### 4. 启动生产服务器

```bash
npm start
```

## 🎯 Next.js 核心概念

### 1. App Router（应用路由）

Next.js 13+ 引入了基于文件系统的 App Router：

- `app/page.tsx` → `/` 路由
- `app/about/page.tsx` → `/about` 路由
- `app/api/hello/route.ts` → `/api/hello` API 端点

### 2. 服务端组件 vs 客户端组件

#### 服务端组件（默认）

- ✅ 在服务端渲染
- ✅ 可以直接访问数据库、文件系统
- ✅ 不会增加客户端 JavaScript
- ✅ SEO 友好
- ❌ 不能使用 Hooks（useState、useEffect、useLayoutEffect 等）
- ❌ 不能使用浏览器 API

```tsx
// 服务端组件（默认）
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}
```

#### 客户端组件

- ✅ 可以使用 React Hooks
- ✅ 可以访问浏览器 API
- ✅ 可以处理用户交互
- ❌ 会增加客户端 JavaScript 包大小

```tsx
'use client'; // 必须添加这个指令

import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 3. API 路由（全栈开发）

Next.js 允许在同一个项目中创建后端 API：

```tsx
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### 4. 数据库操作

Next.js API 路由可以安全地连接数据库。项目中使用 SQLite 作为示例：

```tsx
// lib/db.ts - 数据库连接
import Database from 'better-sqlite3';

export function getDatabase() {
  const db = new Database('data/database.db');
  // 初始化表结构...
  return db;
}

// app/api/tasks/route.ts - 数据库操作 API
import { getDatabase } from '@/lib/db';

export async function GET() {
  const db = getDatabase();
  const tasks = db.prepare('SELECT * FROM tasks').all();
  return NextResponse.json({ data: tasks });
}
```

查看 `/database-demo` 页面了解完整的 CRUD 操作示例。

### 5. 数据获取

#### 服务端获取（推荐）

```tsx
// 在服务端组件中直接获取
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const json = await data.json();
  return <div>{json.title}</div>;
}
```

#### 客户端获取

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
}
```

## 🏗️ Next.js 工作原理

### 1. 渲染模式

#### 服务端渲染 (SSR)

- 每次请求都在服务端生成 HTML
- 适合需要实时数据的页面
- 使用 `async` 组件即可实现

#### 静态生成 (SSG)

- 构建时生成 HTML
- 适合内容不经常变化的页面
- Next.js 会自动优化

#### 增量静态再生 (ISR)

- 结合 SSG 和 SSR 的优势
- 可以设置重新验证时间

### 2. 路由系统

Next.js 使用文件系统作为路由：

```
app/
  page.tsx           → /
  about/
    page.tsx         → /about
  blog/
    [id]/
      page.tsx       → /blog/:id (动态路由)
    [[...slug]]/
      page.tsx       → /blog/* (捕获所有路由)
```

### 3. 代码分割

Next.js 自动进行代码分割：

- 每个路由只加载必要的代码
- 共享代码会被提取到公共 chunk
- 优化首屏加载时间

### 4. 图片优化

```tsx
import Image from 'next/image';

<Image src='/image.jpg' width={500} height={300} alt='描述' />;
```

Next.js 会自动：

- 延迟加载图片
- 响应式图片
- WebP 格式转换
- 防止布局偏移

## 🚢 部署

### 1. Vercel 部署（推荐）

Vercel 是 Next.js 的创建者提供的部署平台，最简单：

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

**优势：**

- ✅ 零配置
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动预览部署
- ✅ 环境变量管理

### 2. 自托管部署

#### 使用 Docker

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

更新 `next.config.js`：

```js
const nextConfig = {
  output: 'standalone', // 启用独立输出
};
```

构建和运行：

```bash
docker build -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```

#### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 启动
pm2 start npm --name "nextjs-app" -- start
```

### 3. 其他部署平台

- **Netlify**：类似 Vercel，支持 Next.js
- **AWS Amplify**：AWS 的部署服务
- **Railway**：简单的部署平台
- **DigitalOcean App Platform**：支持 Docker 和 Node.js

## 📝 环境变量

创建 `.env.local` 文件：

```env
# 服务端和客户端都可以访问
NEXT_PUBLIC_API_URL=https://api.example.com

# 仅服务端可以访问（默认）
DATABASE_URL=postgresql://...
API_SECRET_KEY=your-secret-key
```

使用环境变量：

```tsx
// 服务端组件或 API 路由
const apiKey = process.env.API_SECRET_KEY;

// 客户端组件（需要 NEXT_PUBLIC_ 前缀）
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## 🔧 常用配置

### next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用严格模式
  reactStrictMode: true,

  // 图片域名
  images: {
    domains: ['example.com'],
  },

  // 重定向
  async redirects() {
    return [
      {
        source: '/old',
        destination: '/new',
        permanent: true,
      },
    ];
  },

  // 自定义 headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
};

module.exports = nextConfig;
```

## 📖 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js 学习路径](https://nextjs.org/learn)
- [React 文档](https://react.dev)

## 🎓 项目示例说明

1. **首页** (`/`)：项目概览和导航
2. **API 示例** (`/api-demo`)：展示如何调用 API 路由
3. **服务端组件** (`/server-demo`)：服务端组件特性
4. **客户端组件** (`/client-demo`)：客户端组件和交互
5. **用户列表** (`/users`)：服务端数据获取
6. **数据库操作** (`/database-demo`)：完整的 CRUD 操作示例

## 💡 最佳实践

1. **优先使用服务端组件**：减少客户端 JavaScript
2. **合理使用客户端组件**：只在需要交互时使用
3. **API 路由用于后端逻辑**：数据库操作、外部 API 调用等
4. **使用 TypeScript**：提高代码质量和开发体验
5. **优化图片**：使用 Next.js Image 组件
6. **代码分割**：利用动态导入减少初始包大小

## 🐛 常见问题

### Q: 服务端组件和客户端组件可以混用吗？

A: 可以！客户端组件可以嵌套在服务端组件中，但服务端组件不能嵌套在客户端组件中。

### Q: API 路由可以连接数据库吗？

A: 可以！API 路由运行在服务端，可以安全地使用数据库连接和 API 密钥。

### Q: 如何选择 SSR 还是 SSG？

A: 需要实时数据用 SSR，内容静态用 SSG，需要两者结合用 ISR。

### Q: Prisma 是什么？什么时候使用？

A: Prisma 是一个现代化的 ORM 工具，提供类型安全的数据库操作。适合需要类型安全、数据库迁移管理的项目。查看 `PRISMA.md` 了解详情。

## 📄 License

MIT
