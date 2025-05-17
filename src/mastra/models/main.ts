import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const provider = createOpenRouter({
  apiKey: process.env.OPENAI_API_KEY,
});

const main_model = provider(process.env.MODEL_NAME!);

export default main_model;
