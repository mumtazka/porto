import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import type { ChatSession, ChatMessage } from '../types/database';

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch { }
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

const CHAT_SESSIONS_STORAGE_KEY = 'portfolio_chat_sessions';

export const createChatSessionQuery = async (visitorName?: string): Promise<string | null> => {
  try {
    if (!isSupabaseConfigured()) {
      const newSession: ChatSession = {
        id: Math.random().toString(36).substr(2, 9),
        visitor_name: visitorName || null,
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const stored = loadFromStorage<ChatSession>(CHAT_SESSIONS_STORAGE_KEY, []);
      const updated = [newSession, ...stored];
      saveToStorage(CHAT_SESSIONS_STORAGE_KEY, updated);
      return newSession.id;
    }
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{ visitor_name: visitorName || null, messages: [] }])
      .select()
      .single();
    if (error) throw error;
    return data.id;
  } catch (err) {
    console.error('Failed to create chat session:', err);
    return null;
  }
};

export const addChatMessageQuery = async (sessionId: string, message: ChatMessage): Promise<boolean> => {
  try {
    if (!isSupabaseConfigured()) {
      const stored = loadFromStorage<ChatSession>(CHAT_SESSIONS_STORAGE_KEY, []);
      const updated = stored.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            messages: [...s.messages, message],
            updated_at: new Date().toISOString(),
          };
        }
        return s;
      });
      saveToStorage(CHAT_SESSIONS_STORAGE_KEY, updated);
      return true;
    }
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('messages')
      .eq('id', sessionId)
      .single();
    if (error) throw error;
    const currentMessages = (data?.messages as ChatMessage[]) || [];
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({
        messages: [...currentMessages, message],
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);
    if (updateError) throw updateError;
    return true;
  } catch (err) {
    console.error('Failed to add message to session:', err);
    return false;
  }
};

export const fetchChatSessionsQuery = async (): Promise<ChatSession[]> => {
  try {
    if (!isSupabaseConfigured()) {
      return loadFromStorage<ChatSession>(CHAT_SESSIONS_STORAGE_KEY, []);
    }
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return loadFromStorage<ChatSession>(CHAT_SESSIONS_STORAGE_KEY, []);
  }
};

export const deleteChatSessionQuery = async (id: string): Promise<{ error: null | Error }> => {
  if (!isSupabaseConfigured()) {
    const stored = loadFromStorage<ChatSession>(CHAT_SESSIONS_STORAGE_KEY, []);
    const updated = stored.filter(s => s.id !== id);
    saveToStorage(CHAT_SESSIONS_STORAGE_KEY, updated);
    return { error: null };
  }
  return await supabase.from('chat_sessions').delete().eq('id', id);
};
