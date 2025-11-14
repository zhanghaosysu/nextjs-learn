'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApiDemo() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  // 调用我们自己的 API 路由
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hello');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 调用带参数的 API
  const fetchWithParams = async () => {
    if (!input.trim()) {
      alert('请输入用户名');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/user?name=${encodeURIComponent(input)}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // POST 请求示例
  const postData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello from client!',
          timestamp: new Date().toISOString(),
        }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='container'>
      <Link href='/' style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← 返回首页
      </Link>

      <h1>API 路由示例</h1>

      <div className='card'>
        <h2>什么是 API 路由？</h2>
        <p>
          Next.js 允许你在 <code>app/api</code> 目录下创建 API 端点。
          这些端点运行在服务端，可以处理 GET、POST 等 HTTP 请求。 这就是 Next.js
          全栈开发的核心！
        </p>
      </div>

      <div className='card'>
        <h2>GET 请求示例</h2>
        <button onClick={fetchData} className='button' disabled={loading}>
          {loading ? '加载中...' : '调用 /api/hello'}
        </button>
      </div>

      <div className='card'>
        <h2>GET 请求（带参数）</h2>
        <input
          type='text'
          placeholder='输入用户名'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='input'
          style={{ marginBottom: '1rem' }}
        />
        <button onClick={fetchWithParams} className='button' disabled={loading}>
          {loading ? '加载中...' : '调用 /api/user'}
        </button>
      </div>

      <div className='card'>
        <h2>POST 请求示例</h2>
        <button onClick={postData} className='button' disabled={loading}>
          {loading ? '加载中...' : '发送 POST 请求'}
        </button>
      </div>

      {data && (
        <div className='card'>
          <h2>API 响应：</h2>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className='card'>
        <h2>API 路由位置</h2>
        <p>查看以下文件了解 API 实现：</p>
        <ul>
          <li>
            <code>app/api/hello/route.ts</code> - GET 请求示例
          </li>
          <li>
            <code>app/api/user/route.ts</code> - 带参数的 GET 请求
          </li>
          <li>
            <code>app/api/data/route.ts</code> - POST 请求示例
          </li>
        </ul>
      </div>
    </main>
  );
}
