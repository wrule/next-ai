import { Agent } from '@mastra/core/agent';
import main_model from '@/mastra/models/main';

export const JSONAgent = new Agent({
  name: 'JSONAgent',
  instructions: '',
  model: main_model,
});
