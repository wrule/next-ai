import { mastra } from '@/mastra';
import { NextRequest } from 'next/server';

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

  const uid = crypto.randomUUID();
  const decoder = new TextDecoder('utf-8');
  const openAiTransform = new TransformStream({
    transform: (chunk, controller) => {
      const text = decoder.decode(chunk);
      if (text.startsWith('0:')) {
        controller.enqueue(chatCompletionChunk(uid, JSON.parse(text.slice(2))));
      } else if (text.startsWith('d:')) {
        controller.enqueue('data: [DONE]\n\n');
      } else {
        controller.enqueue(chatCompletionChunk(uid, ''));
      }
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
