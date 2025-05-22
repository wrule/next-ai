
export
const chatCompletionChunk = (uid: string, content: string) => {
  return 'data: ' + JSON.stringify({
    id: uid,
    provider: 'agent',
    model: 'agent',
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    choices: [
      {
        index: 0,
        delta: {
          role: 'assistant',
          content,
        },
      },
    ],
  }) + '\n\n';
}

const openaiStream = (vercelStream: ReadableStream) => {
  const uid = crypto.randomUUID();
  const decoder = new TextDecoder('utf-8');
  const openAiTransform = new TransformStream({
    transform: (chunk, controller) => {
      const text = decoder.decode(chunk);
      if (text.startsWith('0:')) {
        controller.enqueue(chatCompletionChunk(uid, JSON.parse(text.slice(2))));
      } else if (text.startsWith('d:')) {
        controller.enqueue('data: [DONE]\n\n');
      } else {
        controller.enqueue(chatCompletionChunk(uid, ''));
      }
    },
  });
  return vercelStream.pipeThrough(openAiTransform);
}

export default openaiStream;
