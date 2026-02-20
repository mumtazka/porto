import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function wipe() {
  console.log("Wiping dummy projects...");
  await supabase.from('projects').delete().in('title', [
    'E-Commerce Platform', 'Task Management App', 'AI Content Generator',
    'Social Media Dashboard', 'Fitness Tracking App', 'Real Estate Platform'
  ]);
  
  console.log("Wiping dummy education...");
  await supabase.from('education').delete().in('institution', [
    'Universitas Gadjah Mada', 'Google Cloud', 'AWS', 'Meta'
  ]);

  console.log("Wiping dummy achievements...");
  await supabase.from('achievements').delete().in('title', [
    'Google Cloud Professional Architect', 'AWS Solutions Architect Associate', 'Meta Front-End Developer'
  ]);

  console.log("Done.");
}

wipe();
