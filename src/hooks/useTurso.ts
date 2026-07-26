import { useState, useEffect, useCallback } from 'react';
import { tursoApi, isTursoConfigured } from '../utils/tursoClient';
import type { Project, Education, Message, Achievement, PersonalContext as PersonalContextType, ChatSession } from '../types/database';
import { fetchChatSessionsQuery, deleteChatSessionQuery } from './useChatQuery';

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

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      if (!isTursoConfigured()) {
        setProjects(loadFromStorage<Project>('portfolio_projects', []));
        setLoading(false);
        return;
      }
      const data = await tursoApi.get<Project[]>('/api/projects');
      setProjects(data || []);
    } catch {
      setProjects(loadFromStorage<Project>('portfolio_projects', []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projects.length > 0) {
      saveToStorage('portfolio_projects', projects);
    }
  }, [projects]);

  const addProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
    if (!isTursoConfigured()) {
      const newProject = {
        ...project,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setProjects(prev => [newProject, ...prev]);
      return { data: newProject, error: null };
    }
    try {
      const data = await tursoApi.post<Project>('/api/projects', project);
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error };
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!isTursoConfigured()) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return { error: null };
    }
    try {
      await tursoApi.patch<Project>(`/api/projects/${id}`, updates);
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  const deleteProject = async (id: string) => {
    if (!isTursoConfigured()) {
      setProjects(prev => {
        const updated = prev.filter(p => p.id !== id);
        saveToStorage('portfolio_projects', updated);
        return updated;
      });
      return { error: null };
    }
    try {
      await tursoApi.delete(`/api/projects/${id}`);
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  return { projects, loading, addProject, updateProject, deleteProject, refetch: fetchProjects };
};

export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEducation = useCallback(async () => {
    try {
      setLoading(true);
      if (!isTursoConfigured()) {
        setEducation(loadFromStorage<Education>('portfolio_education', []));
        setLoading(false);
        return;
      }
      const data = await tursoApi.get<Education[]>('/api/education');
      setEducation(data || []);
    } catch {
      setEducation(loadFromStorage<Education>('portfolio_education', []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  useEffect(() => {
    if (education.length > 0) {
      saveToStorage('portfolio_education', education);
    }
  }, [education]);

  const addEducation = async (edu: Omit<Education, 'id' | 'created_at'>) => {
    if (!isTursoConfigured()) {
      const newEdu = {
        ...edu,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setEducation(prev => [newEdu, ...prev]);
      return { data: newEdu, error: null };
    }
    try {
      const data = await tursoApi.post<Education>('/api/education', edu);
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error };
    }
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    if (!isTursoConfigured()) {
      setEducation(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      return { error: null };
    }
    try {
      await tursoApi.patch<Education>(`/api/education/${id}`, updates);
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  const deleteEducation = async (id: string) => {
    if (!isTursoConfigured()) {
      setEducation(prev => {
        const updated = prev.filter(e => e.id !== id);
        saveToStorage('portfolio_education', updated);
        return updated;
      });
      return { error: null };
    }
    try {
      await tursoApi.delete(`/api/education/${id}`);
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  return { education, loading, addEducation, updateEducation, deleteEducation, refetch: fetchEducation };
};

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      if (!isTursoConfigured()) {
        setAchievements(loadFromStorage<Achievement>('portfolio_achievements', []));
        setLoading(false);
        return;
      }
      const data = await tursoApi.get<Achievement[]>('/api/achievements');
      setAchievements(data || []);
    } catch {
      setAchievements(loadFromStorage<Achievement>('portfolio_achievements', []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  useEffect(() => {
    if (achievements.length > 0) {
      saveToStorage('portfolio_achievements', achievements);
    }
  }, [achievements]);

  const addAchievement = async (achievement: Omit<Achievement, 'id' | 'created_at'>) => {
    if (!isTursoConfigured()) {
      const newAchievement = {
        ...achievement,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setAchievements(prev => [newAchievement, ...prev]);
      return { data: newAchievement, error: null };
    }
    try {
      const data = await tursoApi.post<Achievement>('/api/achievements', achievement);
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error };
    }
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    if (!isTursoConfigured()) {
      setAchievements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
      return { error: null };
    }
    try {
      await tursoApi.patch<Achievement>(`/api/achievements/${id}`, updates);
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  const deleteAchievement = async (id: string) => {
    if (!isTursoConfigured()) {
      setAchievements(prev => {
        const updated = prev.filter(a => a.id !== id);
        saveToStorage('portfolio_achievements', updated);
        return updated;
      });
      return { error: null };
    }
    try {
      await tursoApi.delete(`/api/achievements/${id}`);
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  return { achievements, loading, addAchievement, updateAchievement, deleteAchievement, refetch: fetchAchievements };
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: Omit<Message, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      if (!isTursoConfigured()) {
        const newMessage = {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
        };
        const stored = loadFromStorage<Message>('portfolio_messages', []);
        const updated = [newMessage, ...stored];
        saveToStorage('portfolio_messages', updated);
        return { success: true, error: null };
      }
      const data = await tursoApi.post<Message>('/api/messages', message);
      return { success: true, data, error: null };
    } catch (err: unknown) {
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!isTursoConfigured()) {
      setMessages(loadFromStorage<Message>('portfolio_messages', []));
      return;
    }
    try {
      const data = await tursoApi.get<Message[]>('/api/messages');
      setMessages(data || []);
    } catch {
      setMessages(loadFromStorage<Message>('portfolio_messages', []));
    }
  }, []);

  const deleteMessage = async (id: string) => {
    if (!isTursoConfigured()) {
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== id);
        saveToStorage('portfolio_messages', updated);
        return updated;
      });
      return { error: null };
    }
    try {
      await tursoApi.delete(`/api/messages/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  return { messages, loading, sendMessage, fetchMessages, deleteMessage };
};

function readStoredUser(): unknown {
  try {
    const storedUser = localStorage.getItem('portfolio_admin_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const [user, setUser] = useState<unknown>(readStoredUser);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { user?: unknown; error?: string };
      if (!response.ok || data.error) {
        return { error: { message: data.error || 'Invalid email or password.' } };
      }
      localStorage.setItem('portfolio_admin_user', JSON.stringify(data.user));
      setUser(data.user);
      return { data: data.user, error: null };
    } catch (error: unknown) {
      return { error: { message: error instanceof Error ? error.message : 'Failed to sign in.' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('portfolio_admin_user');
    return { error: null };
  };

  return { user, loading: false, signIn, signOut };
};

const DEFAULT_CONTEXT: PersonalContextType = {
  id: undefined,
  name: 'Mumtaz Kholafiyan Alfan',
  role: 'Full Stack Developer',
  location: 'Yogyakarta, Indonesia',
  bio: 'Passionate full-stack developer...',
  email: 'mumtazalfan1307@gmail.com',
  phone: '+62 858 0121 4943',
  linkedin: 'https://linkedin.com/in/mumtazka',
  github: 'https://github.com/mumtazka',
  instagram: 'https://instagram.com/mumtazka',
  availability: 'Open to freelance projects and full-time opportunities',
  yearsOfExperience: '3+',
  skills: 'React, Node.js, TypeScript...',
  interests: 'Open source contribution...',
  languages: 'Indonesian (native), English (fluent)',
  extraNotes: '',
};

const CONTEXT_STORAGE_KEY = 'portfolio_ai_context';

export const usePersonalContext = () => {
  const [context, setContext] = useState<PersonalContextType>(() => {
    try {
      const stored = localStorage.getItem(CONTEXT_STORAGE_KEY);
      if (stored) return { ...DEFAULT_CONTEXT, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_CONTEXT;
    }
    return DEFAULT_CONTEXT;
  });

  useEffect(() => {
    const fetchContext = async () => {
      if (!isTursoConfigured()) return;

      try {
        const data = await tursoApi.get<Record<string, unknown>>('/api/personal-context');

        if (data) {
          const text = (value: unknown): string => typeof value === 'string' ? value : '';
          const mapped: PersonalContextType = {
            id: typeof data.id === 'number' ? data.id : undefined,
            name: text(data.name),
            role: text(data.role),
            location: text(data.location),
            bio: text(data.bio),
            email: text(data.email),
            phone: text(data.phone),
            linkedin: text(data.linkedin),
            github: text(data.github),
            instagram: text(data.instagram),
            availability: text(data.availability),
            yearsOfExperience: text(data.years_of_experience),
            skills: text(data.skills),
            interests: text(data.interests),
            languages: text(data.languages),
            extraNotes: text(data.extra_notes),
          };
          setContext(mapped);
          localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(mapped));
        }
      } catch {
        return;
      }
    };

    fetchContext();
  }, []);

  const updateContext = async (updates: Partial<PersonalContextType>) => {
    setContext(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    if (isTursoConfigured()) {
      const dbPayload: Record<string, string | undefined> = {
        name: updates.name,
        role: updates.role,
        location: updates.location,
        bio: updates.bio,
        email: updates.email,
        phone: updates.phone,
        linkedin: updates.linkedin,
        github: updates.github,
        instagram: updates.instagram,
        availability: updates.availability,
        years_of_experience: updates.yearsOfExperience,
        skills: updates.skills,
        interests: updates.interests,
        languages: updates.languages,
        extra_notes: updates.extraNotes,
      };

      Object.keys(dbPayload).forEach(key => {
        if (dbPayload[key] === undefined) delete dbPayload[key];
      });

      try {
        await tursoApi.post<Record<string, unknown>>('/api/personal-context', dbPayload);
      } catch {
        return;
      }
    }
  };

  const resetContext = async () => {
    localStorage.removeItem(CONTEXT_STORAGE_KEY);
    setContext(DEFAULT_CONTEXT);
  };

  return { context, updateContext, resetContext };
};

export const getPersonalContext = (): PersonalContextType => {
  try {
    const stored = localStorage.getItem(CONTEXT_STORAGE_KEY);
    if (stored) return { ...DEFAULT_CONTEXT, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_CONTEXT;
  }
  return DEFAULT_CONTEXT;
};

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const data = await fetchChatSessionsQuery();
    setSessions(data);
    setLoading(false);
  }, []);

  const deleteSession = async (id: string) => {
    await deleteChatSessionQuery(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return {
    sessions,
    loading,
    fetchSessions,
    deleteSession,
  };
};
