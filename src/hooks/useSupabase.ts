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
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch {
      setProjects(loadFromStorage('portfolio_projects', mockProjects));
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
    if (!isSupabaseConfigured()) {
      const newProject = {
        ...project,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      setProjects(prev => [newProject, ...prev]);
      return { data: newProject, error: null };
    }
    return await supabase.from('projects').insert([project]).select().single();
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!isSupabaseConfigured()) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return { error: null };
    }
    return await supabase.from('projects').update(updates).eq('id', id);
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
    return await supabase.from('projects').delete().eq('id', id);
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
      const { data, error } = await supabase.from('education').select('*').order('start_date', { ascending: false });
      if (error) throw error;
      setEducation(data || []);
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
    return await supabase.from('education').insert([edu]).select().single();
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    if (!isSupabaseConfigured()) {
      setEducation(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      return { error: null };
    }
    return await supabase.from('education').update(updates).eq('id', id);
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
    return await supabase.from('education').delete().eq('id', id);
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
      const { data, error } = await supabase.from('achievements').select('*').order('date', { ascending: false });
      if (error) throw error;
      setAchievements(data || []);
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
    return await supabase.from('achievements').insert([achievement]).select().single();
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    if (!isSupabaseConfigured()) {
      setAchievements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
      return { error: null };
    }
    return await supabase.from('achievements').update(updates).eq('id', id);
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
    return await supabase.from('achievements').delete().eq('id', id);
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
      return await supabase.from('messages').insert([message]).select().single();
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
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (!error) setMessages(data || []);
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
    return await supabase.from('messages').delete().eq('id', id);
  };

  return { messages, loading, sendMessage, fetchMessages, deleteMessage };
};

// Auth Hook
export const useAuth = () => {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Allow mock login for dev without Supabase? No, user wants production safety.
      // But we can check localStorage for mock user if we really wanted.
      // For now, let's assume Supabase IS configured or we fail.
      const storedUser = localStorage.getItem('portfolio_admin_user');
      if (storedUser) setUser(JSON.parse(storedUser));
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
      // Mock auth removed for security/production requirement
      return { error: { message: 'Supabase not configured. Cannot log in securely.' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
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
  id?: number;
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
  skills: string;
  interests: string;
  languages: string;
  extraNotes: string;
}

const DEFAULT_CONTEXT: PersonalContext = {
  name: 'Mumtaz Kholafiyan Alfan',
  role: 'Full Stack Developer',
  location: 'Yogyakarta, Indonesia',
  bio: 'Passionate full-stack developer...',
  email: 'hello@mumtaz.dev',
  phone: '+62 812 3456 7890',
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
  const [context, setContext] = useState<PersonalContext>(() => {
    try {
      const stored = localStorage.getItem(CONTEXT_STORAGE_KEY);
      if (stored) return { ...DEFAULT_CONTEXT, ...JSON.parse(stored) };
    } catch { }
    return DEFAULT_CONTEXT;
  });

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchContext = async () => {
      if (!isSupabaseConfigured()) return;

      const { data, error } = await supabase
        .from('personal_context')
        .select('*')
        .single();

      if (!error && data) {
        // Map snake_case from DB to camelCase for app
        const mapped: PersonalContext = {
          id: data.id,
          name: data.name || '',
          role: data.role || '',
          location: data.location || '',
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          instagram: data.instagram || '',
          availability: data.availability || '',
          yearsOfExperience: data.years_of_experience || '',
          skills: data.skills || '',
          interests: data.interests || '',
          languages: data.languages || '',
          extraNotes: data.extra_notes || ''
        };
        setContext(mapped);
        localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(mapped));
      }
    };

    fetchContext();
  }, []);

  const updateContext = async (updates: Partial<PersonalContext>) => {
    // 1. Optimistic update (local)
    setContext(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    // 2. Persist to Supabase
    if (isSupabaseConfigured()) {
      // Map back to snake_case
      const dbPayload = {
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
        extra_notes: updates.extraNotes
      };

      // Remove undefined keys
      Object.keys(dbPayload).forEach(key =>
        (dbPayload as any)[key] === undefined && delete (dbPayload as any)[key]
      );

      // Check if we have an ID to update, otherwise insert
      if (context.id) {
        await supabase.from('personal_context').update(dbPayload).eq('id', context.id);
      } else {
        // Try to find existing row first, or insert
        const { data } = await supabase.from('personal_context').select('id').single();
        if (data) {
          await supabase.from('personal_context').update(dbPayload).eq('id', data.id);
        } else {
          await supabase.from('personal_context').insert([dbPayload]);
        }
      }
    }
  };

  const resetContext = async () => {
    localStorage.removeItem(CONTEXT_STORAGE_KEY);
    setContext(DEFAULT_CONTEXT);
  };

  return { context, updateContext, resetContext };
};

// Helper to read context without React (used by AIChatbot synchronously)
export const getPersonalContext = (): PersonalContext => {
  try {
    const stored = localStorage.getItem(CONTEXT_STORAGE_KEY);
    if (stored) return { ...DEFAULT_CONTEXT, ...JSON.parse(stored) };
  } catch { }
  return DEFAULT_CONTEXT;
};
