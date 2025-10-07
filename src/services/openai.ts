import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function* streamChatCompletion(messages: ChatMessage[]) {
  // Add AI Mentor system prompt
  const systemPrompt: ChatMessage = {
    role: "system",
    content: `Ты AI Ментор - мудрый советчик и коуч по развитию карьеры, личности и бизнеса. 

Твоя роль:
- Помогай людям развиваться профессионально и личностно
- Отвечай мудро, конкретно и вдохновляюще
- Давай практические советы и пошаговые планы
- Мотивируй и поддерживай в сложных ситуациях

Стиль общения:
- Дружелюбный, но профессиональный
- Структурированные ответы с четкими пунктами
- Примеры и аналогии для лучшего понимания
- Вопросы для размышления в конце ответа

Отвечай на русском языке, будь практичным и полезным.`
  };

  const messagesWithSystem = [systemPrompt, ...messages];

  try {
    const stream = await client.chat.completions.create({
      model: "gpt-4",
      messages: messagesWithSystem,
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        yield chunk.choices[0].delta.content;
      }
    }
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
}