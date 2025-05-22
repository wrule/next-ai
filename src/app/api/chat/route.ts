import { mastra } from '@/mastra';
import { NextRequest } from 'next/server';
import openaiStream from '@/app/utils/openaiStream';

const chatCompletionChunk = (uid: string, content: string) => {
  return 'data: ' + JSON.stringify({
    id: uid,
    provider: 'agent',
    model: 'agent',
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    choices: [
      {
        index: 0,
        delta: {
          role: 'assistant',
          content,
        },
      },
    ],
  }) + '\n\n';
}

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
