# 数据库操作指南

本指南介绍如何在 Next.js 项目中进行数据库操作。

## 📦 使用的技术

- **SQLite**：轻量级文件数据库，无需单独服务器
- **better-sqlite3**：高性能的 SQLite Node.js 驱动

## 🗂️ 项目结构

```
lib/
  ├── db.ts          # 数据库连接和初始化
  └── types.ts       # TypeScript 类型定义

app/
  ├── api/
  │   └── tasks/
  │       ├── route.ts        # 任务列表 API (GET, POST)
  │       └── [id]/
  │           └── route.ts    # 单个任务 API (GET, PUT, DELETE)
  └── database-demo/
      └── page.tsx            # 前端界面
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

依赖会自动安装 `better-sqlite3` 和类型定义。

### 2. 数据库初始化

数据库会在首次访问时自动创建。数据库文件位于 `data/database.db`。

### 3. 启动项目

```bash
npm run dev
```

访问 `http://localhost:3000/database-demo` 查看数据库操作示例。

## 📝 数据库操作示例

### 创建任务 (CREATE)

```tsx
// app/api/tasks/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description)
    VALUES (?, ?)
  `);

  const result = stmt.run(body.title, body.description);
  return NextResponse.json({ id: result.lastInsertRowid });
}
```

### 读取任务 (READ)

```tsx
// 获取所有任务
export async function GET() {
  const db = getDatabase();
  const tasks = db.prepare('SELECT * FROM tasks').all();
  return NextResponse.json({ data: tasks });
}

// 获取单个任务
export async function GET(request, { params }) {
  const db = getDatabase();
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(params.id);
  return NextResponse.json({ data: task });
}
```

### 更新任务 (UPDATE)

```tsx
// app/api/tasks/[id]/route.ts
export async function PUT(request, { params }) {
  const body = await request.json();
  const db = getDatabase();

  const stmt = db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, updated_at = datetime('now')
    WHERE id = ?
  `);

  stmt.run(body.title, body.description, params.id);
  return NextResponse.json({ success: true });
}
```

### 删除任务 (DELETE)

```tsx
export async function DELETE(request, { params }) {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(params.id);
  return NextResponse.json({ success: true });
}
```

## 🔧 数据库连接管理

### 单例模式

```tsx
// lib/db.ts
let db: Database.Database | null = null;

export function getDatabase() {
  if (db) {
    return db; // 复用现有连接
  }

  db = new Database('data/database.db');
  initializeTables(db);
  return db;
}
```

**优势：**

- 避免重复创建连接
- 提高性能
- 简化连接管理

## 📊 表结构

### tasks 表

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  completed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🛡️ 安全注意事项

### 1. 使用参数化查询

✅ **正确**：防止 SQL 注入

```tsx
const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
const task = stmt.get(id);
```

❌ **错误**：容易受到 SQL 注入攻击

```tsx
const task = db.prepare(`SELECT * FROM tasks WHERE id = ${id}`).get();
```

### 2. 输入验证

```tsx
if (!title || title.trim() === '') {
  return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
}
```

### 3. 错误处理

```tsx
try {
  const result = db.prepare('...').run();
  return NextResponse.json({ success: true });
} catch (error) {
  console.error('数据库操作失败:', error);
  return NextResponse.json({ error: '操作失败' }, { status: 500 });
}
```

## 🔄 迁移到其他数据库

### PostgreSQL

```tsx
// 安装依赖
npm install pg
npm install -D @types/pg

// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
```

### MySQL

```tsx
// 安装依赖
npm install mysql2

// lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function query(text: string, params?: any[]) {
  return pool.execute(text, params);
}
```

## 📈 性能优化

### 1. 使用索引

```sql
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
```

### 2. 批量操作

```tsx
const insert = db.prepare('INSERT INTO tasks (title) VALUES (?)');
const insertMany = db.transaction((tasks) => {
  for (const task of tasks) {
    insert.run(task.title);
  }
});

insertMany([...]); // 批量插入
```

### 3. 连接池（适用于 PostgreSQL/MySQL）

```tsx
// 使用连接池管理数据库连接
const pool = new Pool({
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
});
```

## 🐛 常见问题

### Q: 数据库文件在哪里？

A: 数据库文件位于 `data/database.db`。首次运行时会自动创建。

### Q: 如何重置数据库？

A: 删除 `data/database.db` 文件，下次运行时会自动重新创建。

### Q: 可以在生产环境使用 SQLite 吗？

A: SQLite 适合小型应用和开发环境。对于生产环境，建议使用 PostgreSQL 或 MySQL。

### Q: 如何处理数据库迁移？

A: 可以使用 Prisma、TypeORM 等 ORM 工具来管理数据库迁移。查看 `PRISMA.md` 了解如何使用 Prisma。

## 📚 学习资源

- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [better-sqlite3 文档](https://github.com/WiseLibs/better-sqlite3)
- [Next.js 数据库集成](https://nextjs.org/docs/app/building-your-application/data-fetching)
