import { useState, useEffect, useCallback } from 'react';
import { mockProjects, mockEducation, mockAchievements, isSupabaseConfigured, supabase } from '../utils/supabaseClient';
import type { Project, Education, Message, Achievement } from '../types/database';

// Helper: load from localStorage or fallback
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

// Projects Hook
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        setProjects(loadFromStorage('portfolio_projects', mockProjects));
        setLoading(false);
        return;
      }
    } catch {
      setProjects(loadFromStorage('portfolio_projects', mockProjects));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Persist whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      saveToStorage('portfolio_projects', projects);
    }
  }, [projects]);

  const addProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured()) {
      const newProject = {
        ...project,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setProjects(prev => [newProject, ...prev]);
      return { data: newProject, error: null };
    }
    return { data: null, error: null };
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!isSupabaseConfigured()) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return { error: null };
    }
    return { error: null };
  };

  const deleteProject = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setProjects(prev => {
        const updated = prev.filter(p => p.id !== id);
        saveToStorage('portfolio_projects', updated);
        return updated;
      });
      return { error: null };
    }
    return { error: null };
  };

  return { projects, loading, addProject, updateProject, deleteProject, refetch: fetchProjects };
};

// Education Hook
export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEducation = useCallback(async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        setEducation(loadFromStorage('portfolio_education', mockEducation));
        setLoading(false);
        return;
      }
    } catch {
      setEducation(loadFromStorage('portfolio_education', mockEducation));
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
    if (!isSupabaseConfigured()) {
      const newEdu = {
        ...edu,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setEducation(prev => [newEdu, ...prev]);
      return { data: newEdu, error: null };
    }
    return { data: null, error: null };
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    if (!isSupabaseConfigured()) {
      setEducation(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      return { error: null };
    }
    return { error: null };
  };

  const deleteEducation = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setEducation(prev => {
        const updated = prev.filter(e => e.id !== id);
        saveToStorage('portfolio_education', updated);
        return updated;
      });
      return { error: null };
    }
    return { error: null };
  };

  return { education, loading, addEducation, updateEducation, deleteEducation, refetch: fetchEducation };
};

// Achievements Hook
export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        setAchievements(loadFromStorage('portfolio_achievements', mockAchievements));
        setLoading(false);
        return;
      }
    } catch {
      setAchievements(loadFromStorage('portfolio_achievements', mockAchievements));
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
    if (!isSupabaseConfigured()) {
      const newAchievement = {
        ...achievement,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setAchievements(prev => [newAchievement, ...prev]);
      return { data: newAchievement, error: null };
    }
    return { data: null, error: null };
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    if (!isSupabaseConfigured()) {
      setAchievements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
      return { error: null };
    }
    return { error: null };
  };

  const deleteAchievement = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setAchievements(prev => {
        const updated = prev.filter(a => a.id !== id);
        saveToStorage('portfolio_achievements', updated);
        return updated;
      });
      return { error: null };
    }
    return { error: null };
  };

  return { achievements, loading, addAchievement, updateAchievement, deleteAchievement, refetch: fetchAchievements };
};

// Messages Hook
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: Omit<Message, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
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
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setMessages(loadFromStorage('portfolio_messages', []));
      return;
    }
  }, []);

  const deleteMessage = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== id);
        saveToStorage('portfolio_messages', updated);
        return updated;
      });
      return { error: null };
    }
    return { error: null };
  };

  return { messages, loading, sendMessage, fetchMessages, deleteMessage };
};

// Auth Hook
export const useAuth = () => {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const storedUser = localStorage.getItem('portfolio_admin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
      return;
    }

    // Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      if (email === 'munas@gmail.com' && password === 'mumtaz1307') {
        const userData = { email };
        setUser(userData);
        localStorage.setItem('portfolio_admin_user', JSON.stringify(userData));
        return { data: { user: userData }, error: null };
      }
      return { error: { message: 'Invalid credentials' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    return { data, error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('portfolio_admin_user');
    return { error: null };
  };

  return { user, loading, signIn, signOut };
};

// ─── Personal Context (AI Brain) ────────────────────────────────────────────

export interface PersonalContext {
  name: string;
  role: string;
  location: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  instagram: string;
  availability: string;
  yearsOfExperience: string;
  skills: string;        // comma-separated
  interests: string;     // comma-separated
  languages: string;     // e.g. "Indonesian (native), English (fluent)"
  extraNotes: string;    // free-form extra info for the AI
}

const DEFAULT_CONTEXT: PersonalContext = {
  name: 'Mumtaz Kholafiyan Alfan',
  role: 'Full Stack Developer',
  location: 'Yogyakarta, Indonesia',
  bio: 'Passionate full-stack developer who loves building scalable web applications and creating exceptional digital experiences. Focused on clean code, modern technologies, and solving complex problems.',
  email: 'hello@mumtaz.dev',
  phone: '+62 812 3456 7890',
  linkedin: 'https://linkedin.com/in/mumtazka',
  github: 'https://github.com/mumtazka',
  instagram: 'https://instagram.com/mumtazka',
  availability: 'Open to freelance projects and full-time opportunities',
  yearsOfExperience: '3+',
  skills: 'React, Node.js, TypeScript, PostgreSQL, MongoDB, Tailwind CSS, Next.js, Python, Docker, Supabase, GraphQL, Redis, Vue.js, Express, Prisma, Firebase, Git, Figma, Linux, Nginx, Vite',
  interests: 'Open source contribution, Machine Learning, Cloud Architecture, UI/UX Design',
  languages: 'Indonesian (native), English (fluent)',
  extraNotes: '',
};

const CONTEXT_STORAGE_KEY = 'portfolio_ai_context';

export const usePersonalContext = () => {
  const [context, setContext] = useState<PersonalContext>(() => {
    try {
      const stored = localStorage.getItem(CONTEXT_STORAGE_KEY);
      if (stored) return { ...DEFAULT_CONTEXT, ...JSON.parse(stored) };
    } catch { }
    return DEFAULT_CONTEXT;
  });

  const updateContext = (updates: Partial<PersonalContext>) => {
    setContext(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetContext = () => {
    localStorage.removeItem(CONTEXT_STORAGE_KEY);
    setContext(DEFAULT_CONTEXT);
  };

  return { context, updateContext, resetContext };
};

// Helper to read context without React (used by AIChatbot at call time)
export const getPersonalContext = (): PersonalContext => {
  try {
    const stored = localStorage.getItem(CONTEXT_STORAGE_KEY);
    if (stored) return { ...DEFAULT_CONTEXT, ...JSON.parse(stored) };
  } catch { }
  return DEFAULT_CONTEXT;
};

