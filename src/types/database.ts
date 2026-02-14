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
    };
  };
}

export type Project = Database['public']['Tables']['projects']['Row'];
export type Education = Database['public']['Tables']['education']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
