import { useState, useEffect } from 'react';
import { Chat, getChats, deleteChat as deleteChatFromDB } from '../services/chats';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const fetchedChats = await getChats();
      setChats(fetchedChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (id: string) => {
    try {
      await deleteChatFromDB(id);
      setChats(prev => prev.filter(chat => chat.id !== id));
      if (selectedChatId === id) {
        setSelectedChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const clearAllChats = () => {
    // For now, just clear locally - in the future we could batch delete from DB
    setChats([]);
    setSelectedChatId(null);
  };

  const refreshChats = () => {
    loadChats();
  };

  return {
    chats,
    isLoading,
    selectedChatId,
    setSelectedChatId,
    deleteChat,
    clearAllChats,
    refreshChats,
  };
}