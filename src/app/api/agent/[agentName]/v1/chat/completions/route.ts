import { mastra } from '@/mastra';
import { NextRequest, NextResponse } from 'next/server';
import openaiStream, { chatCompletion } from '@/app/utils/openaiStream';

const sseHeaders = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Connection': 'keep-alive',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { agentName: Parameters<typeof mastra.getAgent>[0] } },
) {
  try {
    const uid = crypto.randomUUID();
    const agent = mastra.getAgent(params.agentName);
    const requestParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = requestParams.query || 'hello';
    delete requestParams.query;
    const stream = requestParams.stream !== 'false';
    delete requestParams.stream;
    if (stream) {
      const vercelStream = (await agent.stream(query, requestParams)).toDataStream();
      return new Response(openaiStream(uid, vercelStream), { headers: sseHeaders });
    } else {
      const { text: content } = await agent.generate(query, requestParams);
      return NextResponse.json(chatCompletion(uid, content));
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message,
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { agentName: Parameters<typeof mastra.getAgent>[0] } },
) {
  const uid = crypto.randomUUID();
  const agent = mastra.getAgent(params.agentName);
  const requestParams = await request.json();
  const messages = requestParams.messages;
  delete requestParams.messages;
  const stream = !!requestParams.stream;
  delete requestParams.stream;
  delete requestParams.model;
  if (stream) {
    const vercelStream = (await agent.stream(messages, requestParams)).toDataStream();
    return new Response(openaiStream(uid, vercelStream), { headers: sseHeaders });
  } else {
    const { text: content } = await agent.generate(messages, requestParams);
    return NextResponse.json(chatCompletion(uid, content));
  }
}
