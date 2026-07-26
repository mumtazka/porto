import { tursoApi, isTursoConfigured } from '../utils/tursoClient';
import type { ChatSession, ChatMessage } from '../types/database';

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    return fallback;
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

const CHAT_SESSIONS_STORAGE_KEY = 'portfolio_chat_sessions';

export const createChatSessionQuery = async (visitorName?: string): Promise<string | null> => {
  try {
    if (!isTursoConfigured()) {
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
    const data = await tursoApi.post<{ id: string }>('/api/chat-sessions', {
      visitor_name: visitorName || null,
    });
    return data.id;
  } catch (err) {
    console.error('Failed to create chat session:', err);
    return null;
  }
};

export const addChatMessageQuery = async (sessionId: string, message: ChatMessage): Promise<boolean> => {
  try {
    if (!isTursoConfigured()) {
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
    const session = await tursoApi.get<ChatSession>(`/api/chat-sessions/${sessionId}`);
    const currentMessages = session?.messages || [];
    await tursoApi.patch(`/api/chat-sessions/${sessionId}`, {
      messages: [...currentMessages, message],
      updated_at: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Failed to add message to session:', err);
    return false;
  }
};

export const fetchChatSessionsQuery = async (): Promise<ChatSession[]> => {
  try {
    if (!isTursoConfigured()) {
      return loadFromStorage<ChatSession>(CHAT_SESSIONS_STORAGE_KEY, []);
    }
    const data = await tursoApi.get<ChatSession[]>('/api/chat-sessions');
    return data || [];
  } catch {
    return loadFromStorage<ChatSession>(CHAT_SESSIONS_STORAGE_KEY, []);
  }
};

export const deleteChatSessionQuery = async (id: string): Promise<{ error: Error | null }> => {
  if (!isTursoConfigured()) {
    const stored = loadFromStorage<ChatSession>(CHAT_SESSIONS_STORAGE_KEY, []);
    const updated = stored.filter(s => s.id !== id);
    saveToStorage(CHAT_SESSIONS_STORAGE_KEY, updated);
    return { error: null };
  }
  try {
    await tursoApi.delete(`/api/chat-sessions/${id}`);
    return { error: null };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error : null };
  }
};
