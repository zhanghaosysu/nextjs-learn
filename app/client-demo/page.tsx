'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 这是一个客户端组件
// 注意文件顶部的 'use client' 指令
export default function ClientDemo() {
  const [count, setCount] = useState(0);
  const [clientTime, setClientTime] = useState<string>('');

  useEffect(() => {
    // 客户端组件可以使用浏览器 API
    setClientTime(new Date().toISOString());

    // 可以使用 localStorage
    const savedCount = localStorage.getItem('count');
    if (savedCount) {
      setCount(parseInt(savedCount));
    }
  }, []);

  useEffect(() => {
    // 保存计数到 localStorage
    localStorage.setItem('count', count.toString());
  }, [count]);

  return (
    <main className='container'>
      <Link href='/' style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← 返回首页
      </Link>

      <h1>客户端组件示例</h1>

      <div className='card'>
        <h2>什么是客户端组件？</h2>
        <p>
          客户端组件在浏览器中运行，可以使用 React Hooks 和浏览器 API。
          需要在文件顶部添加 <code>&apos;use client&apos;</code> 指令。
        </p>
        <ul>
          <li>✅ 可以使用 useState、useEffect 等 Hooks</li>
          <li>✅ 可以访问浏览器 API（window、localStorage 等）</li>
          <li>✅ 可以处理用户交互（点击、输入等）</li>
          <li>⚠️ 会增加客户端 JavaScript 包大小</li>
        </ul>
      </div>

      <div className='card'>
        <h2>交互示例</h2>
        <p>
          当前计数：<strong style={{ fontSize: '1.5rem' }}>{count}</strong>
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => setCount(count - 1)} className='button'>
            -1
          </button>
          <button onClick={() => setCount(0)} className='button'>
            重置
          </button>
          <button onClick={() => setCount(count + 1)} className='button'>
            +1
          </button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          这个计数会保存到 localStorage，刷新页面后仍然保留。
        </p>
      </div>

      <div className='card'>
        <h2>客户端时间</h2>
        <p>客户端时间：{clientTime || '加载中...'}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          这个时间是在客户端（浏览器）中生成的。
        </p>
      </div>

      <div className='card'>
        <h2>何时使用客户端组件？</h2>
        <ul>
          <li>需要用户交互（按钮、表单等）</li>
          <li>需要使用 React Hooks</li>
          <li>需要使用浏览器 API</li>
          <li>需要状态管理（useState、useReducer）</li>
          <li>需要生命周期效果（useEffect）</li>
        </ul>
      </div>

      <div className='card'>
        <h2>最佳实践</h2>
        <p>
          尽量使用服务端组件，只在需要交互性时才使用客户端组件。
          可以将客户端组件嵌套在服务端组件中，实现最佳性能。
        </p>
      </div>
    </main>
  );
}
