import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

console.log(process.env);

const provider = createOpenAICompatible({
  name: 'provider',
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL!,
});

const main_model = provider(process.env.MODEL_NAME!);

export default main_model;
