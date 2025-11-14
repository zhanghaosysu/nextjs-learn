import Link from 'next/link';

// 这是一个服务端组件（默认）
// 它会在服务端执行，不会发送到客户端
export default async function ServerDemo() {
  // 在服务端组件中可以直接访问环境变量、数据库等
  const serverTime = new Date().toISOString();

  // 可以在这里进行数据获取（数据库查询、API 调用等）
  // 这些代码只在服务端运行，不会暴露给客户端

  return (
    <main className='container'>
      <Link href='/' style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← 返回首页
      </Link>

      <h1>服务端组件示例</h1>

      <div className='card'>
        <h2>什么是服务端组件？</h2>
        <p>
          在 Next.js 13+ 的 App Router 中，默认所有组件都是服务端组件。
          它们会在服务端渲染，然后发送 HTML 到客户端。
        </p>
        <ul>
          <li>✅ 可以直接访问数据库、文件系统等</li>
          <li>✅ 不会增加客户端 JavaScript 包大小</li>
          <li>✅ 可以安全地使用 API 密钥和敏感信息</li>
          <li>✅ 自动进行 SEO 优化</li>
        </ul>
      </div>

      <div className='card'>
        <h2>服务端数据</h2>
        <p>这个时间是在服务端生成的：</p>
        <p
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#0070f3',
          }}
        >
          {serverTime}
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          每次刷新页面，这个时间都会更新，因为组件在服务端重新渲染。
        </p>
      </div>

      <div className='card'>
        <h2>如何识别服务端组件？</h2>
        <ul>
          <li>
            没有 <code>&apos;use client&apos;</code> 指令
          </li>
          <li>
            可以使用 <code>async/await</code> 直接获取数据
          </li>
          <li>不能使用浏览器 API（如 window、localStorage）</li>
          <li>
            不能使用 React Hooks（useState、useEffect、useLayoutEffect 等）
          </li>
        </ul>
      </div>

      <div className='card'>
        <h2>数据获取示例</h2>
        <p>在服务端组件中可以直接获取数据：</p>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            marginTop: '1rem',
          }}
        >
          {`// 在服务端组件中
export default async function Page() {
  // 直接获取数据，不需要 useEffect
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()
  
  return <div>{json.title}</div>
}`}
        </pre>
      </div>
    </main>
  );
}
