import { NextRequest, NextResponse } from 'next/server';

// GET 请求处理（带查询参数）
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: '缺少 name 参数' }, { status: 400 });
  }

  return NextResponse.json({
    message: `你好, ${name}!`,
    user: {
      name,
      id: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
    },
    explanation: '这是一个带查询参数的 GET API 端点',
  });
}
