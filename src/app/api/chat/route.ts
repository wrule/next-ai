import { mastra } from '@/mastra';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const agent = mastra.getAgent('BlankAgent');
  const result = await agent.stream(searchParams.get('query') ?? '你好');

  const dataStream = result.toDataStream();
  const reader = dataStream.getReader();
  while (true) {
    const a = await reader.read();
    const b = a.value;
    if (b) {
      const decoder = new TextDecoder('utf-8');
      console.log(decoder.decode(b));
    }
    if (a.done) {
      break;
    }
  }
  return result.toDataStreamResponse();
}
