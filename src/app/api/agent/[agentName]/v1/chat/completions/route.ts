import { mastra } from '@/mastra';
import { NextRequest, NextResponse } from 'next/server';
import openaiStream, { chatCompletion } from '@/app/utils/openaiStream';

const paramsCollector = async (request: NextRequest) => {
  if (request.method === 'GET') {
    return Object.fromEntries(request.nextUrl.searchParams);
  } else {
    return await request.json();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agentName: Parameters<typeof mastra.getAgent>[0] } },
) {
  const uid = crypto.randomUUID();
  const agent = mastra.getAgent(params.agentName);
  const requestParams = await paramsCollector(request);
  const query = requestParams.query || 'hello';
  delete requestParams.query;
  const stream = requestParams.stream !== 'false';
  delete requestParams.stream;
  if (stream) {
    const vercelStream = (await agent.stream(query, requestParams)).toDataStream();
    return new Response(openaiStream(uid, vercelStream), {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } else {
    const { text: content } = await agent.generate(query, requestParams);
    return NextResponse.json(chatCompletion(uid, content));
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { agentName: Parameters<typeof mastra.getAgent>[0] } },
) {
  const uid = crypto.randomUUID();
  const agent = mastra.getAgent(params.agentName);
  const requestParams = await paramsCollector(request);
  console.log(requestParams);
  const query = requestParams.query || 'hello';
  delete requestParams.query;
  const stream = requestParams.stream;
  delete requestParams.stream;
  if (stream) {
    const vercelStream = (await agent.stream(query)).toDataStream();
    return new Response(openaiStream(uid, vercelStream), {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } else {
    const { text: content } = await agent.generate(query);
    return NextResponse.json(chatCompletion(uid, content));
  }
}
