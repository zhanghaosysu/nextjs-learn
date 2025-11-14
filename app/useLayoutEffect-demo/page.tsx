'use client';

import { useLayoutEffect, useState, useRef } from 'react';
import Link from 'next/link';

// useLayoutEffect 只能在客户端组件中使用
// 它在 DOM 更新后、浏览器绘制前同步执行
export default function UseLayoutEffectDemo() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect 在 DOM 更新后同步执行
  // 适合需要读取 DOM 布局的场景
  useLayoutEffect(() => {
    if (divRef.current) {
      // 同步读取 DOM 尺寸，避免闪烁
      const rect = divRef.current.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
    }
  }, []);

  return (
    <main className='container'>
      <Link href='/' style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← 返回首页
      </Link>

      <h1>useLayoutEffect 示例</h1>

      <div className='card'>
        <h2>什么是 useLayoutEffect？</h2>
        <p>
          <code>useLayoutEffect</code> 是 React 的一个 Hook，它在 DOM
          更新后、浏览器绘制前同步执行。
        </p>
        <ul>
          <li>
            ✅ 只能在<strong>客户端组件</strong>中使用（需要{' '}
            <code>&apos;use client&apos;</code>）
          </li>
          <li>
            ❌ 不能在<strong>服务端组件</strong>中使用（服务端没有 DOM）
          </li>
          <li>适合需要同步读取 DOM 布局的场景，避免视觉闪烁</li>
        </ul>
      </div>

      <div className='card'>
        <h2>useLayoutEffect vs useEffect</h2>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>特性</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>
                useEffect
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>
                useLayoutEffect
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>执行时机</td>
              <td style={{ padding: '0.75rem' }}>异步，浏览器绘制后</td>
              <td style={{ padding: '0.75rem' }}>同步，浏览器绘制前</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>阻塞绘制</td>
              <td style={{ padding: '0.75rem' }}>否</td>
              <td style={{ padding: '0.75rem' }}>是</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>适用场景</td>
              <td style={{ padding: '0.75rem' }}>
                数据获取、订阅、大多数副作用
              </td>
              <td style={{ padding: '0.75rem' }}>
                读取 DOM 布局、避免视觉闪烁
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='card'>
        <h2>实际示例：读取 DOM 尺寸</h2>
        <div
          ref={divRef}
          style={{
            background: '#f0f0f0',
            padding: '2rem',
            borderRadius: '8px',
            margin: '1rem 0',
            border: '2px solid #0070f3',
          }}
        >
          <p>这个 div 的尺寸：</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            宽度: {width}px × 高度: {height}px
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
            使用 useLayoutEffect 在组件挂载后立即同步读取 DOM 尺寸，避免闪烁。
          </p>
        </div>
      </div>

      <div className='card'>
        <h2>代码示例</h2>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            marginTop: '1rem',
          }}
        >
          {`'use client'; // 必须是客户端组件

import { useLayoutEffect, useRef, useState } from 'react';

export default function Component() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  // 同步读取 DOM，避免闪烁
  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }
  }, []);

  return <div ref={ref}>尺寸: {size.width} × {size.height}</div>;
}`}
        </pre>
      </div>

      <div className='card'>
        <h2>何时使用 useLayoutEffect？</h2>
        <ul>
          <li>
            <strong>需要同步读取 DOM 布局</strong>：如获取元素尺寸、位置
          </li>
          <li>
            <strong>避免视觉闪烁</strong>：需要在浏览器绘制前更新样式
          </li>
          <li>
            <strong>动画相关</strong>：需要在绘制前计算动画参数
          </li>
        </ul>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          <strong>注意：</strong>由于 useLayoutEffect
          会阻塞浏览器绘制，应该谨慎使用。大多数情况下，使用 useEffect
          就足够了。
        </p>
      </div>
    </main>
  );
}
