import { NextResponse } from 'next/server';

// GET 请求处理
export async function GET() {
  return NextResponse.json({
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString(),
    method: 'GET',
    explanation: '这是一个简单的 GET API 端点示例',
  });
}
