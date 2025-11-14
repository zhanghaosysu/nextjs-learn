import type { Metadata } from 'next';
import './globals.css';

/**
 * ============================================
 * layout.tsx 的作用和特点
 * ============================================
 *
 * 1. **不是入口文件，而是布局包装器**
 *    - layout.tsx 会包裹所有子路由的页面
 *    - 当路由切换时，layout 不会重新渲染，只有 children 部分会更新
 *    - 这非常适合放置导航栏、侧边栏、页脚等共享 UI
 *
 * 2. **与 page.tsx 的关系**
 *    - layout.tsx: 定义共享的 UI 结构（如 <html>、<body>、导航栏等）
 *    - page.tsx: 定义特定路由的实际内容
 *    - 渲染顺序：layout 包裹 page，即 <Layout><Page /></Layout>
 *
 * 3. **层级结构**
 *    - app/layout.tsx: 根布局（Root Layout），必须包含 <html> 和 <body>
 *    - app/users/layout.tsx: 用户页面的嵌套布局（可选）
 *    - 嵌套布局会层层包裹：RootLayout > UsersLayout > UsersPage
 *
 * 4. **常用用途**
 *    - 设置全局样式（如 globals.css）
 *    - 定义 HTML 元数据（metadata）
 *    - 添加全局导航栏、页脚
 *    - 设置主题提供者（Theme Provider）
 *    - 添加全局状态管理
 */

// 页面元数据配置（SEO、浏览器标签页标题等）
export const metadata: Metadata = {
  title: 'Next.js 学习项目',
  description: '学习 Next.js 全栈开发和部署',
};

/**
 * 根布局组件（Root Layout）
 *
 * 这是整个应用的根布局，所有页面都会被这个布局包裹。
 *
 * @param children - 子路由的页面内容（如 page.tsx 的内容）
 *
 * 注意：
 * - 根布局必须包含 <html> 和 <body> 标签
 * - 这个组件在路由切换时不会重新渲染，只有 children 会更新
 * - 非常适合放置全局导航、页脚等共享 UI
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='zh-CN'>
      <body>
        {/* 
          这里可以添加全局导航栏、页脚等共享组件
          例如：
          <Header />
          {children}
          <Footer />
        */}
        {children}
      </body>
    </html>
  );
}
