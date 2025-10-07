import { supabase } from '../lib/supabase';
import { Database } from '../lib/db_types';
import { ChatMessage } from '../types/chat';
import { nanoid } from '../lib/utils';

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  path: string;
  userId?: string;
}

type ChatRow = Database['public']['Tables']['chats']['Row'];

// Debug mode flag
const DEBUG_MODE = false;
const DEBUG_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function saveChat(chat: Chat, userId?: string): Promise<void> {
  console.log('🔄 Saving chat:', chat.id, chat.title);
  
  let finalUserId: string;
  
  if (DEBUG_MODE) {
    // Use debug user ID
    finalUserId = DEBUG_USER_ID;
    console.log('👤 Debug user ID:', finalUserId);
  } else {
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User not authenticated');
      throw new Error('User must be authenticated to save chats');
    }
    
    finalUserId = user.id;
    console.log('👤 Authenticated user ID:', finalUserId);
  }
  
  const payload = {
    id: chat.id,
    title: chat.title,
    userId: finalUserId,
    createdAt: chat.createdAt,
    path: chat.path,
    messages: chat.messages,
  };

  console.log('📦 Payload:', payload);

  const { data, error } = await supabase
    .from('chats')
    .upsert({
      id: chat.id,
      user_id: finalUserId,
      payload
    });

  if (error) {
    console.error('❌ Error saving chat:', error);
    throw error;
  }
  
  console.log('✅ Chat saved successfully:', data);
}

export async function getChats(): Promise<Chat[]> {
  let finalUserId: string;
  
  if (DEBUG_MODE) {
    finalUserId = DEBUG_USER_ID;
  } else {
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User not authenticated for getChats');
      return [];
    }
    
    finalUserId = user.id;
  }

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', finalUserId)
    .order('payload->createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }

  return (data || []).map(row => {
    const payload = row.payload as any;
    return {
      id: payload.id,
      title: payload.title,
      messages: payload.messages || [],
      createdAt: payload.createdAt,
      path: payload.path,
      userId: payload.userId,
    };
  });
}

export async function getChat(id: string): Promise<Chat | null> {
  console.log('🔍 Loading chat:', id);
  
  let finalUserId: string;
  
  if (DEBUG_MODE) {
    finalUserId = DEBUG_USER_ID;
  } else {
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User not authenticated for getChat');
      return null;
    }
    
    finalUserId = user.id;
  }
  
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('id', id)
    .eq('user_id', finalUserId)
    .single();

  if (error) {
    console.error('❌ Error fetching chat:', error);
    return null;
  }

  if (!data) {
    console.log('❌ No data found for chat:', id);
    return null;
  }
  
  const payload = data.payload as any;
  
  if (!payload) {
    console.error('❌ No payload in chat data');
    return null;
  }
  
  // Normalize messages timestamps
  const normalizedMessages = (payload.messages || []).map((msg: any) => ({
    ...msg,
    timestamp: msg.timestamp || new Date().toISOString()
  }));
  
  const chat = {
    id: payload.id || data.id,
    title: payload.title || 'Без названия',
    messages: normalizedMessages,
    createdAt: payload.createdAt || data.created_at,
    path: payload.path || `/chat/${data.id}`,
    userId: payload.userId,
  };
  
  console.log('✅ Chat loaded:', chat.title, 'with', chat.messages.length, 'messages');
  return chat;
}

export async function deleteChat(id: string): Promise<void> {
  let finalUserId: string;
  
  if (DEBUG_MODE) {
    finalUserId = DEBUG_USER_ID;
  } else {
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User not authenticated for deleteChat');
      throw new Error('User must be authenticated to delete chats');
    }
    
    finalUserId = user.id;
  }

  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', id)
    .eq('user_id', finalUserId);

  if (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
}