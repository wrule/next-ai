
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
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');
  const openAiTransform = new TransformStream({
    transform: (chunk, controller) => {
      let sendText = chatCompletionChunk(uid, '');
      try {
        const text = decoder.decode(chunk);
        if (text.startsWith('0:')) {
          sendText = chatCompletionChunk(uid, JSON.parse(text.slice(2)));
        } else if (text.startsWith('d:')) {
          sendText = 'data: [DONE]\n\n';
        }
      } catch (error) {
        console.error(error);
      }
      controller.enqueue(encoder.encode(sendText));
    },
  });
  return vercelStream.pipeThrough(openAiTransform);
}

export default openaiStream;
