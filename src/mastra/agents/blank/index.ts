import main_model from '@/mastra/models/main';
import { Agent } from '@mastra/core/agent';

export const BlankAgent = new Agent({
  name: 'BlankAgent',
  instructions: '',
  model: main_model,
});
