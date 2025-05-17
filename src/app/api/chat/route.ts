import { mastra } from '@/mastra';

export async function GET(request: Request) {
  const agent = mastra.getAgent('BlankAgent');
  const result = await agent.stream('你好');
  return result.toDataStreamResponse();
}
