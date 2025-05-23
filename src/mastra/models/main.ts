import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// const provider = createOpenRouter({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const provider = createQwen({
//   baseURL: process.env.BASE_URL!,
//   apiKey: process.env.OPENAI_API_KEY,
// });

const provider = createOpenAICompatible({
  name: 'provider',
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.OPENAI_API_KEY,
});

const main_model = provider(process.env.MODEL_NAME!);

export default main_model;
