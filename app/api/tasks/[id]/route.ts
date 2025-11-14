import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { UpdateTaskInput } from '@/lib/types';

// GET: 获取单个任务
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase();
    const task = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(parseInt(params.id));

    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('获取任务失败:', error);
    return NextResponse.json(
      { success: false, error: '获取任务失败' },
      { status: 500 }
    );
  }
}

// PUT: 更新任务
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateTaskInput = await request.json();
    const db = getDatabase();

    // 检查任务是否存在
    const existingTask = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(parseInt(params.id));

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      );
    }

    // 构建更新语句
    const updates: string[] = [];
    const values: any[] = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      values.push(body.title.trim());
    }

    if (body.description !== undefined) {
      updates.push('description = ?');
      values.push(body.description?.trim() || null);
    }

    if (body.completed !== undefined) {
      updates.push('completed = ?');
      values.push(body.completed ? 1 : 0);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: '没有要更新的字段' },
        { status: 400 }
      );
    }

    updates.push("updated_at = datetime('now')");
    values.push(parseInt(params.id));

    const stmt = db.prepare(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`
    );
    stmt.run(...values);

    // 获取更新后的任务
    const updatedTask = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(parseInt(params.id));

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: '任务更新成功',
    });
  } catch (error) {
    console.error('更新任务失败:', error);
    return NextResponse.json(
      { success: false, error: '更新任务失败' },
      { status: 500 }
    );
  }
}

// DELETE: 删除任务
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase();

    // 检查任务是否存在
    const existingTask = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(parseInt(params.id));

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      );
    }

    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(parseInt(params.id));

    return NextResponse.json({
      success: true,
      message: '任务删除成功',
    });
  } catch (error) {
    console.error('删除任务失败:', error);
    return NextResponse.json(
      { success: false, error: '删除任务失败' },
      { status: 500 }
    );
  }
}
