/**
 * ============================================
 * page.tsx 的作用和特点
 * ============================================
 *
 * 1. **这是路由的入口文件**
 *    - page.tsx 定义了特定路由的实际内容
 *    - app/page.tsx 对应根路由 "/"
 *    - app/users/page.tsx 对应 "/users" 路由
 *
 * 2. **与 layout.tsx 的关系**
 *    - layout.tsx 包裹 page.tsx
 *    - 渲染结构：<Layout><Page /></Layout>
 *    - layout 提供共享 UI，page 提供页面内容
 *
 * 3. **文件系统路由规则**
 *    - app/page.tsx → "/" 路由
 *    - app/about/page.tsx → "/about" 路由
 *    - app/users/page.tsx → "/users" 路由
 *    - app/users/[id]/page.tsx → "/users/:id" 动态路由
 *
 * 4. **默认是服务端组件**
 *    - 默认在服务端渲染（Server Component）
 *    - 如果需要客户端交互，添加 'use client' 指令
 *    - 可以直接访问数据库、API 等（服务端）
 */

import Link from 'next/link';
import './page.css';

/**
 * 首页组件
 *
 * 这是根路由 "/" 的页面内容。
 * 会被 app/layout.tsx 包裹渲染。
 */
export default function Home() {
  return (
    <main className='container'>
      <h1>Next.js 全栈开发学习项目</h1>

      <div className='card'>
        <h2>项目特性</h2>
        <ul>
          <li>✅ 服务端渲染 (SSR)</li>
          <li>✅ 静态生成 (SSG)</li>
          <li>✅ API 路由（全栈开发）</li>
          <li>✅ 客户端组件</li>
          <li>✅ 服务端组件</li>
        </ul>
      </div>

      <div className='card'>
        <h2>示例页面</h2>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href='/api-demo' className='button'>
            API 示例
          </Link>
          <Link href='/server-demo' className='button'>
            服务端组件示例
          </Link>
          <Link href='/client-demo' className='button'>
            客户端组件示例
          </Link>
          <Link href='/users' className='button'>
            用户列表（数据获取）
          </Link>
          <Link href='/useLayoutEffect-demo' className='button'>
            useLayoutEffect 示例
          </Link>
          <Link href='/database-demo' className='button'>
            数据库操作示例
          </Link>
        </nav>
      </div>

      <div className='card'>
        <h2>Next.js 核心概念</h2>
        <p>Next.js 是一个基于 React 的全栈框架，它提供了：</p>
        <ul>
          <li>
            <strong>App Router</strong>：基于文件系统的路由（当前项目使用）
          </li>
          <li>
            <strong>API Routes</strong>：在同一个项目中创建后端 API
          </li>
          <li>
            <strong>Server Components</strong>：默认在服务端渲染，减少客户端
            JavaScript
          </li>
          <li>
            <strong>Client Components</strong>：需要交互性的组件在客户端渲染
          </li>
          <li>
            <strong>自动代码分割</strong>：只加载需要的代码
          </li>
          <li>
            <strong>图片优化</strong>：自动优化图片加载
          </li>
        </ul>
      </div>
    </main>
  );
}
