import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { CreateTaskInput } from '@/lib/types';

// GET: 获取所有任务
export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const searchParams = request.nextUrl.searchParams;
    const completed = searchParams.get('completed');

    let query = 'SELECT * FROM tasks';
    const params: any[] = [];

    // 如果指定了 completed 参数，进行过滤
    if (completed !== null) {
      query += ' WHERE completed = ?';
      params.push(completed === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';

    const tasks = db.prepare(query).all(...params);

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('获取任务失败:', error);
    return NextResponse.json(
      { success: false, error: '获取任务失败' },
      { status: 500 }
    );
  }
}

// POST: 创建新任务
export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskInput = await request.json();

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { success: false, error: '任务标题不能为空' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, created_at, updated_at)
      VALUES (?, ?, datetime('now'), datetime('now'))
    `);

    const result = stmt.run(
      body.title.trim(),
      body.description?.trim() || null
    );

    // 获取刚创建的任务
    const task = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(result.lastInsertRowid);

    return NextResponse.json(
      {
        success: true,
        data: task,
        message: '任务创建成功',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建任务失败:', error);
    return NextResponse.json(
      { success: false, error: '创建任务失败' },
      { status: 500 }
    );
  }
}
