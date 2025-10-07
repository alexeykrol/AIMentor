import { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from '../types/chat';
import { streamChatCompletion } from '../services/openai';
import { saveChat, Chat, getChat } from '../services/chats';
import { nanoid } from '../lib/utils';

export function useChat(chatId?: string, onChatSaved?: () => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);

  // Load chat when chatId changes
  useEffect(() => {
    const loadChat = async () => {
      if (chatId) {
        console.log('📂 Loading chat messages for:', chatId);
        try {
          const chat = await getChat(chatId);
          if (chat) {
            console.log('✅ Chat loaded successfully, setting messages:', chat.messages.length);
            setMessages(chat.messages);
            setCurrentChatId(chat.id);
          } else {
            console.log('❌ Chat not found or null, clearing messages');
            setMessages([]);
            setCurrentChatId(null);
          }
        } catch (error) {
          console.error('❌ Error loading chat:', error);
          setMessages([]);
          setCurrentChatId(null);
        }
      } else {
        // Clear messages when no chat is selected
        console.log('🧹 Clearing messages - no chat selected');
        setMessages([]);
        setCurrentChatId(null);
      }
    };

    loadChat();
  }, [chatId]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Prepare messages for OpenAI
      const allMessages = [...messages, userMessage];
      const openaiMessages = allMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Create assistant message that will be updated with streaming content
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        content: '',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Stream the response
      let accumulatedContent = '';
      for await (const chunk of streamChatCompletion(openaiMessages)) {
        accumulatedContent += chunk;

        // Update the assistant message with accumulated content
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }

      setIsTyping(false);

      // Save chat to database
      try {
        const finalMessages = [...allMessages, { 
          id: assistantMessageId, 
          content: accumulatedContent, 
          role: 'assistant' as const, 
          timestamp: new Date().toISOString() 
        }];
        
        const chatIdToUse = currentChatId || nanoid();
        const title = allMessages[0]?.content.substring(0, 100) || 'Новый чат';
        
        const chat: Chat = {
          id: chatIdToUse,
          title,
          messages: finalMessages,
          createdAt: Date.now(),
          path: `/chat/${chatIdToUse}`,
        };

        await saveChat(chat);
        
        if (!currentChatId) {
          setCurrentChatId(chatIdToUse);
        }
        
        // Notify parent component that chat was saved
        onChatSaved?.();
      } catch (saveError) {
        console.error('Error saving chat:', saveError);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [messages, onChatSaved]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    currentChatId,
  };
}