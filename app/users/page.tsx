import Link from 'next/link';

// 模拟数据获取（实际项目中可以连接数据库）
async function getUsers() {
  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '开发者' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '设计师' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: '产品经理' },
  ];
}

// 这是一个服务端组件，可以直接获取数据
export default async function UsersPage() {
  const users = await getUsers();

  return (
    <main className='container'>
      <Link href='/' style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← 返回首页
      </Link>

      <h1>用户列表</h1>

      <div className='card'>
        <h2>服务端数据获取</h2>
        <p>
          这个页面展示了如何在服务端组件中获取数据。 数据在服务端获取，然后作为
          HTML 发送到客户端，有利于 SEO 和性能。
        </p>
      </div>

      <div className='card'>
        <h2>用户列表</h2>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>姓名</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>邮箱</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>角色</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem' }}>{user.id}</td>
                <td style={{ padding: '0.75rem' }}>{user.name}</td>
                <td style={{ padding: '0.75rem' }}>{user.email}</td>
                <td style={{ padding: '0.75rem' }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='card'>
        <h2>数据获取方式对比</h2>
        <ul>
          <li>
            <strong>服务端获取（当前方式）</strong>：在服务端获取数据，HTML
            包含数据，SEO 友好
          </li>
          <li>
            <strong>客户端获取</strong>：使用 useEffect +
            fetch，需要额外的加载状态
          </li>
          <li>
            <strong>静态生成</strong>：构建时获取数据，适合不经常变化的内容
          </li>
        </ul>
      </div>
    </main>
  );
}
