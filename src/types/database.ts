export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string;
          tech_stack: string[];
          project_url: string | null;
          github_url: string | null;
          featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url: string;
          tech_stack?: string[];
          project_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string;
          tech_stack?: string[];
          project_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          created_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string;
          field: string;
          start_date: string;
          end_date: string;
          certificate_image: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          degree: string;
          field: string;
          start_date: string;
          end_date: string;
          certificate_image?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          degree?: string;
          field?: string;
          start_date?: string;
          end_date?: string;
          certificate_image?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          date: string;
          description: string | null;
          credential_url: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          date: string;
          description?: string | null;
          credential_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          date?: string;
          description?: string | null;
          credential_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      personal_context: {
        Row: {
          id: number;
          name: string | null;
          role: string | null;
          location: string | null;
          bio: string | null;
          email: string | null;
          phone: string | null;
          linkedin: string | null;
          github: string | null;
          instagram: string | null;
          availability: string | null;
          years_of_experience: string | null;
          skills: string | null;
          interests: string | null;
          languages: string | null;
          extra_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          role?: string | null;
          location?: string | null;
          bio?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin?: string | null;
          github?: string | null;
          instagram?: string | null;
          availability?: string | null;
          years_of_experience?: string | null;
          skills?: string | null;
          interests?: string | null;
          languages?: string | null;
          extra_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          role?: string | null;
          location?: string | null;
          bio?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin?: string | null;
          github?: string | null;
          instagram?: string | null;
          availability?: string | null;
          years_of_experience?: string | null;
          skills?: string | null;
          interests?: string | null;
          languages?: string | null;
          extra_notes?: string | null;
          created_at?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          visitor_name: string | null;
          messages: ChatMessage[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          visitor_name?: string | null;
          messages?: ChatMessage[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          visitor_name?: string | null;
          messages?: ChatMessage[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

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

export type Project = Database['public']['Tables']['projects']['Row'];
export type Education = Database['public']['Tables']['education']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];
