import { NextRequest, NextResponse } from 'next/server';

// POST 请求处理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      received: body,
      serverMessage: '数据已成功接收并处理',
      processedAt: new Date().toISOString(),
      explanation: '这是一个 POST API 端点，可以接收 JSON 数据',
    });
  } catch (error) {
    return NextResponse.json({ error: '无效的 JSON 数据' }, { status: 400 });
  }
}
