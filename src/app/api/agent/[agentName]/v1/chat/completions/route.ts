import { mastra } from '@/mastra';
import { NextRequest, NextResponse } from 'next/server';
import openaiStream from '@/app/utils/openaiStream';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const agent = mastra.getAgent('BlankAgent');
  const vercelStream = (await agent.stream(searchParams.get('query') ?? '你好')).toDataStream();
  return new Response(openaiStream(vercelStream), {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  if (body.stream) {
    const { searchParams } = request.nextUrl;
    const agent = mastra.getAgent('BlankAgent');
    const vercelStream = (await agent.stream(searchParams.get('query') ?? '你好')).toDataStream();
    return new Response(openaiStream(vercelStream), {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } else {
    return NextResponse.json({

    });
  }
}
