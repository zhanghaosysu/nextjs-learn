'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: number;
  created_at: string;
  updated_at: string;
}

export default function DatabaseDemo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // 获取任务列表
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/tasks';
      if (filter === 'completed') {
        url += '?completed=true';
      } else if (filter === 'pending') {
        url += '?completed=false';
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setTasks(result.data);
      } else {
        setError(result.error || '获取任务失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // 创建任务
  const createTask = async () => {
    if (!newTask.title.trim()) {
      setError('任务标题不能为空');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewTask({ title: '', description: '' });
        await fetchTasks(); // 刷新列表
      } else {
        setError(result.error || '创建任务失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 切换任务完成状态
  const toggleTask = async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTasks(); // 刷新列表
      } else {
        setError(result.error || '更新任务失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 删除任务
  const deleteTask = async (id: number) => {
    if (!confirm('确定要删除这个任务吗？')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchTasks(); // 刷新列表
      } else {
        setError(result.error || '删除任务失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取任务
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <main className='container'>
      <Link href='/' style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← 返回首页
      </Link>

      <h1>数据库操作示例</h1>

      <div className='card'>
        <h2>什么是数据库操作？</h2>
        <p>
          这个示例展示了如何在 Next.js 中进行完整的数据库操作（CRUD：
          创建、读取、更新、删除）。我们使用 SQLite
          作为数据库，它不需要单独的数据库服务器，非常适合学习和开发。
        </p>
        <ul>
          <li>✅ 创建任务（CREATE）</li>
          <li>✅ 读取任务列表（READ）</li>
          <li>✅ 更新任务状态（UPDATE）</li>
          <li>✅ 删除任务（DELETE）</li>
        </ul>
      </div>

      <div className='card'>
        <h2>创建新任务</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type='text'
            placeholder='任务标题 *'
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className='input'
          />
          <textarea
            placeholder='任务描述（可选）'
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              minHeight: '80px',
            }}
          />
          <button
            onClick={createTask}
            className='button'
            disabled={loading || !newTask.title.trim()}
          >
            {loading ? '创建中...' : '创建任务'}
          </button>
        </div>
      </div>

      <div className='card'>
        <h2>任务列表</h2>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setFilter('all')}
            className='button'
            style={{
              background: filter === 'all' ? '#0051cc' : '#0070f3',
            }}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('pending')}
            className='button'
            style={{
              background: filter === 'pending' ? '#0051cc' : '#0070f3',
            }}
          >
            待完成
          </button>
          <button
            onClick={() => setFilter('completed')}
            className='button'
            style={{
              background: filter === 'completed' ? '#0051cc' : '#0070f3',
            }}
          >
            已完成
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fee',
              color: '#c00',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {loading && tasks.length === 0 ? (
          <p>加载中...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: '#666' }}>暂无任务</p>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '1rem',
                  background: task.completed ? '#f0f0f0' : 'white',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: '0 0 0.5rem 0',
                        textDecoration: task.completed
                          ? 'line-through'
                          : 'none',
                        color: task.completed ? '#999' : '#333',
                      }}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p
                        style={{
                          margin: '0 0 0.5rem 0',
                          color: '#666',
                          fontSize: '0.9rem',
                        }}
                      >
                        {task.description}
                      </p>
                    )}
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: '#999',
                      }}
                    >
                      创建于:{' '}
                      {new Date(task.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={() => toggleTask(task)}
                      className='button'
                      style={{
                        background: task.completed ? '#28a745' : '#ffc107',
                        fontSize: '0.9rem',
                        padding: '0.5rem 1rem',
                      }}
                      disabled={loading}
                    >
                      {task.completed ? '已完成' : '待完成'}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className='button'
                      style={{
                        background: '#dc3545',
                        fontSize: '0.9rem',
                        padding: '0.5rem 1rem',
                      }}
                      disabled={loading}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='card'>
        <h2>技术实现</h2>
        <ul>
          <li>
            <strong>数据库</strong>：SQLite（文件数据库，无需单独服务器）
          </li>
          <li>
            <strong>数据库驱动</strong>：better-sqlite3（高性能 SQLite 驱动）
          </li>
          <li>
            <strong>API 路由</strong>：
            <ul>
              <li>
                <code>GET /api/tasks</code> - 获取任务列表
              </li>
              <li>
                <code>POST /api/tasks</code> - 创建新任务
              </li>
              <li>
                <code>GET /api/tasks/[id]</code> - 获取单个任务
              </li>
              <li>
                <code>PUT /api/tasks/[id]</code> - 更新任务
              </li>
              <li>
                <code>DELETE /api/tasks/[id]</code> - 删除任务
              </li>
            </ul>
          </li>
          <li>
            <strong>数据库文件位置</strong>：<code>data/database.db</code>
          </li>
        </ul>
      </div>

      <div className='card'>
        <h2>查看代码</h2>
        <p>了解实现细节，查看以下文件：</p>
        <ul>
          <li>
            <code>lib/db.ts</code> - 数据库连接和初始化
          </li>
          <li>
            <code>lib/types.ts</code> - TypeScript 类型定义
          </li>
          <li>
            <code>app/api/tasks/route.ts</code> - 任务列表 API
          </li>
          <li>
            <code>app/api/tasks/[id]/route.ts</code> - 单个任务操作 API
          </li>
          <li>
            <code>app/database-demo/page.tsx</code> - 前端界面
          </li>
        </ul>
      </div>
    </main>
  );
}
