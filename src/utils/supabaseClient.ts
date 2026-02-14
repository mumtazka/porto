// Supabase client configuration
// To enable Supabase, install: npm install @supabase/supabase-js
// and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables

// import { createClient } from '@supabase/supabase-js';
// import type { Database } from '../types/database';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Mock supabase client for development
export const supabase = {
  from: () => ({
    select: () => ({ data: null, error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
    eq: () => ({ data: null, error: null }),
    order: () => ({ data: null, error: null }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
};

// Mock data for development (when Supabase is not configured)
export const mockProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with real-time inventory, payment integration, and admin dashboard. Built with scalability and performance in mind.',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    project_url: 'https://example.com',
    github_url: 'https://github.com',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management tool with real-time updates, drag-and-drop interface, and team analytics. Perfect for agile teams.',
    image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    tech_stack: ['Next.js', 'TypeScript', 'Prisma', 'Socket.io'],
    project_url: 'https://example.com',
    github_url: 'https://github.com',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'AI Content Generator',
    description: 'AI-powered content generation tool using natural language processing for marketing copy and blog posts. Saves hours of writing time.',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    tech_stack: ['Python', 'FastAPI', 'OpenAI', 'React'],
    project_url: 'https://example.com',
    github_url: 'https://github.com',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media management with data visualization and automated reporting. Track all metrics in one place.',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    tech_stack: ['Vue.js', 'D3.js', 'Express', 'MongoDB'],
    project_url: 'https://example.com',
    github_url: 'https://github.com',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Fitness Tracking App',
    description: 'Mobile-first fitness tracking application with workout plans, progress tracking, and nutrition logging. Your personal fitness companion.',
    image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
    tech_stack: ['React Native', 'Firebase', 'Redux', 'Chart.js'],
    project_url: 'https://example.com',
    github_url: 'https://github.com',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Real Estate Platform',
    description: 'Property listing and management platform with virtual tours, mortgage calculator, and agent portal. Find your dream home easily.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    tech_stack: ['Angular', 'Django', 'PostgreSQL', 'AWS'],
    project_url: 'https://example.com',
    github_url: 'https://github.com',
    featured: true,
    created_at: new Date().toISOString(),
  },
];

export const mockEducation = [
  {
    id: '1',
    institution: 'Universitas Gadjah Mada',
    degree: 'Bachelor of Computer Science',
    field: 'Software Engineering',
    start_date: '2019-08-01',
    end_date: '2023-07-01',
    certificate_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    description: 'Graduated with honors. Focused on web development, algorithms, and software architecture. Active member of the programming club.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    institution: 'Google Cloud',
    degree: 'Professional Cloud Architect',
    field: 'Cloud Computing',
    start_date: '2023-01-01',
    end_date: '2023-03-01',
    certificate_image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop',
    description: 'Certified in designing, developing, and managing robust, secure, scalable cloud solutions on Google Cloud Platform.',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    institution: 'AWS',
    degree: 'Solutions Architect Associate',
    field: 'Cloud Infrastructure',
    start_date: '2023-06-01',
    end_date: '2023-08-01',
    certificate_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    description: 'Proficient in designing distributed systems on AWS infrastructure. Expertise in EC2, S3, RDS, and Lambda services.',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    institution: 'Meta',
    degree: 'Front-End Developer',
    field: 'Web Development',
    start_date: '2022-09-01',
    end_date: '2022-12-01',
    certificate_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    description: 'Advanced React patterns, state management, and modern front-end architecture. Component design and performance optimization.',
    created_at: new Date().toISOString(),
  },
];

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return false; // Set to true when Supabase is configured
};
