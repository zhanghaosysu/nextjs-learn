# Prisma 简介

## 🤔 Prisma 是什么？

**Prisma** 是一个现代化的 **ORM（对象关系映射）工具**，它让你可以用 TypeScript/JavaScript 代码来操作数据库，而不需要写 SQL 语句。

### 核心特点

- ✅ **类型安全**：自动生成 TypeScript 类型
- ✅ **数据库迁移**：版本控制数据库结构
- ✅ **查询构建器**：直观的 API，替代 SQL
- ✅ **多数据库支持**：PostgreSQL、MySQL、SQLite、SQL Server 等
- ✅ **开发体验**：自动补全、类型检查

## 📊 Prisma vs 原生 SQL

### 原生 SQL（当前项目使用的方式）

```tsx
// 使用 better-sqlite3
const db = getDatabase();
const tasks = db.prepare('SELECT * FROM tasks WHERE completed = ?').all(0);
```

**优点：**

- 性能高
- 完全控制 SQL
- 适合简单项目

**缺点：**

- 需要手写 SQL
- 没有类型安全
- 需要手动管理迁移

### Prisma（ORM 方式）

```tsx
// 使用 Prisma
const tasks = await prisma.task.findMany({
  where: { completed: false },
});
```

**优点：**

- 类型安全
- 自动补全
- 数据库迁移管理
- 更易维护

**缺点：**

- 需要学习 Prisma 语法
- 稍微增加项目复杂度

## 🚀 在 Next.js 中使用 Prisma

### 1. 安装 Prisma

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. 初始化 Prisma

```bash
npx prisma init
```

这会创建：

- `prisma/schema.prisma` - 数据库模型定义
- `.env` - 数据库连接字符串

### 3. 定义数据模型

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("tasks")
}
```

### 4. 生成 Prisma Client

```bash
npx prisma generate
```

### 5. 创建数据库和表

```bash
npx prisma db push
# 或使用迁移
npx prisma migrate dev --name init
```

### 6. 在代码中使用

```tsx
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// app/api/tasks/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ data: tasks });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });
  return NextResponse.json({ data: task });
}
```

## 📝 Prisma 常用操作

### 查询（Query）

```tsx
// 查找所有
const tasks = await prisma.task.findMany();

// 查找单个
const task = await prisma.task.findUnique({
  where: { id: 1 },
});

// 条件查询
const completedTasks = await prisma.task.findMany({
  where: { completed: true },
});

// 分页
const tasks = await prisma.task.findMany({
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' },
});

// 关联查询
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { tasks: true }, // 包含关联的任务
});
```

### 创建（Create）

```tsx
// 创建单个
const task = await prisma.task.create({
  data: {
    title: '新任务',
    description: '任务描述',
  },
});

// 批量创建
const tasks = await prisma.task.createMany({
  data: [{ title: '任务1' }, { title: '任务2' }],
});
```

### 更新（Update）

```tsx
// 更新单个
const task = await prisma.task.update({
  where: { id: 1 },
  data: { completed: true },
});

// 更新多个
const result = await prisma.task.updateMany({
  where: { completed: false },
  data: { completed: true },
});
```

### 删除（Delete）

```tsx
// 删除单个
await prisma.task.delete({
  where: { id: 1 },
});

// 删除多个
await prisma.task.deleteMany({
  where: { completed: true },
});
```

## 🔄 数据库迁移

### 创建迁移

```bash
npx prisma migrate dev --name add_user_table
```

这会：

1. 创建迁移文件
2. 应用到数据库
3. 重新生成 Prisma Client

### 查看迁移历史

```bash
npx prisma migrate status
```

### 在生产环境应用迁移

```bash
npx prisma migrate deploy
```

## 🎨 Prisma Studio（可视化工具）

查看和编辑数据库：

```bash
npx prisma studio
```

打开浏览器访问 `http://localhost:5555`

## 🔗 关系定义

### 一对多关系

```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  tasks Task[] // 一个用户有多个任务
}

model Task {
  id     Int  @id @default(autoincrement())
  title  String
  userId Int  @map("user_id")
  user   User @relation(fields: [userId], references: [id])
}
```

### 多对多关系

```prisma
model Post {
  id       Int       @id @default(autoincrement())
  title    String
  tags     Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}
```

## 🆚 何时使用 Prisma？

### 适合使用 Prisma 的场景

- ✅ 需要类型安全
- ✅ 复杂的数据库关系
- ✅ 团队协作（统一的数据库操作方式）
- ✅ 需要数据库迁移管理
- ✅ 频繁修改数据库结构

### 适合使用原生 SQL 的场景

- ✅ 简单的项目
- ✅ 性能要求极高
- ✅ 需要复杂的 SQL 查询
- ✅ 团队熟悉 SQL

## 📚 学习资源

- [Prisma 官方文档](https://www.prisma.io/docs)
- [Prisma + Next.js 教程](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Prisma 示例项目](https://github.com/prisma/prisma-examples)

## 💡 总结

Prisma 是一个强大的 ORM 工具，特别适合：

- 需要类型安全的项目
- 需要管理数据库迁移的项目
- 团队协作项目

对于学习项目，你可以选择：

- **简单项目**：使用原生 SQL（如当前项目）
- **复杂项目**：使用 Prisma

两者都是有效的选择，取决于你的需求和偏好！
