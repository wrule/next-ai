import { Agent } from '@mastra/core/agent';
import main_model from '@/mastra/models/main';

export const BlankAgent = new Agent({
  name: 'BlankAgent',
  instructions: '',
  model: main_model,
});
