import { useState, useEffect, useCallback } from 'react';
import { supabase, mockProjects, mockEducation, isSupabaseConfigured } from '../utils/supabaseClient';
import type { Project, Education, Message } from '../types/database';

// Projects Hook
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!isSupabaseConfigured()) {
        // Use mock data when Supabase is not configured
        setProjects(mockProjects);
        setLoading(false);
        return;
      }

      // When Supabase is configured, use this:
      // const { data, error } = await supabase
      //   .from('projects')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      // if (error) throw error;
      // setProjects(data || []);
    } catch (err) {
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

    // Supabase implementation when configured
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
      setProjects(prev => prev.filter(p => p.id !== id));
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
        setEducation(mockEducation);
        setLoading(false);
        return;
      }

      // Supabase implementation when configured
    } catch (err) {
      setEducation(mockEducation);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

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
      setEducation(prev => prev.filter(e => e.id !== id));
      return { error: null };
    }

    return { error: null };
  };

  return { education, loading, addEducation, updateEducation, deleteEducation, refetch: fetchEducation };
};

// Messages Hook
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: Omit<Message, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      
      if (!isSupabaseConfigured()) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      setMessages([]);
      return;
    }
  }, []);

  return { messages, loading, sendMessage, fetchMessages };
};

// Auth Hook
export const useAuth = () => {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Mock login for demo
      if (email === 'admin@example.com' && password === 'admin') {
        setUser({ email });
        return { data: { user: { email } }, error: null };
      }
      return { error: { message: 'Invalid credentials' } };
    }

    return { data: null, error: null };
  };

  const signOut = async () => {
    setUser(null);
    return { error: null };
  };

  return { user, loading, signIn, signOut };
};
