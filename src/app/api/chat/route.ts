import { mastra } from '@/mastra';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const agent = mastra.getAgent('BlankAgent');
  const result = await agent.stream(searchParams.get('query') ?? '你好');
  return result.toDataStreamResponse();
}
