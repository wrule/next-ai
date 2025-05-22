import { mastra } from '@/mastra';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const agent = mastra.getAgent('BlankAgent');
  const vercelStream = (await agent.stream(searchParams.get('query') ?? '你好')).toDataStream();

  const decoder = new TextDecoder('utf-8');
  const openAiTransform = new TransformStream({
    transform: (chunk, controller) => {
      const text = decoder.decode(chunk);
      console.log(text);
      controller.enqueue(text);
    },
  });

  return new Response(vercelStream.pipeThrough(openAiTransform), {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
