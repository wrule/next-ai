import { mastra } from '@/mastra';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // const { searchParams } = request.nextUrl;
  // const agent = mastra.getAgent('BlankAgent');
  // const result = await agent.stream(searchParams.get('query') ?? '你好');

  // const dataStream = result.toDataStream();
  // const reader = dataStream.getReader();
  // while (true) {
  //   const a = await reader.read();
  //   const b = a.value;
  //   if (b) {
  //     const decoder = new TextDecoder('utf-8');
  //     console.log(decoder.decode(b));
  //   }
  //   if (a.done) {
  //     break;
  //   }
  // }

  const encoder = new TextEncoder();
  const responseStream = new ReadableStream({
    start: (controller) => {
      let count = 0;
      const timer = setInterval(() => {
        if (count < 5) {
          controller.enqueue(encoder.encode('你好，世界\n'));
        } else {
          controller.enqueue(encoder.encode('结束\n'));
          controller.close();
          clearInterval(timer);
        }
        count++;
      }, 1000);
    },
  });
  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'X-Content-Type-Options': 'nosniff',
    },
  });

  return result.toDataStreamResponse();
}
