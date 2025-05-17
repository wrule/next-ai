import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const provider = createOpenAICompatible({
  name: 'provider',
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL!,
});

const model = provider(process.env.MODEL_NAME!);

export default model;
