import { createClient } from '@libsql/client/web';

type SqlValue = string | number | boolean | null;

function sqlValue(value: unknown): SqlValue {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return value;
  }
  return null;
}

function getDb(env) {
  return createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export async function onRequestOptions() {
  return new Response('ok', { headers: corsHeaders });
}

export async function onRequestGet({ env }) {
  const db = getDb(env);
  const { rows } = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
  const projects = rows.map((row) => ({
    ...row,
    tech_stack: JSON.parse(row.tech_stack || '[]'),
    featured: !!row.featured,
  }));
  return jsonResponse(projects);
}

export async function onRequestPost({ env, request }) {
  const db = getDb(env);
  const body = await request.json();
  const id = generateId();
  const techStack = JSON.stringify(body.tech_stack || []);

  await db.execute({
    sql: 'INSERT INTO projects (id, title, description, image_url, tech_stack, project_url, github_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [
      id,
      body.title,
      body.description,
      body.image_url,
      techStack,
      body.project_url || null,
      body.github_url || null,
      body.featured ? 1 : 0,
    ],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
  const project = { ...rows[0], tech_stack: JSON.parse(rows[0].tech_stack || '[]'), featured: !!rows[0].featured };
  return jsonResponse(project, 201);
}

export async function onRequestPatch({ env, request, params }) {
  const db = getDb(env);
  const body = await request.json();
  const id = params.id;

  const fields: string[] = [];
  const values: SqlValue[] = [];
  const entries = { ...body };
  if ('tech_stack' in entries) {
    entries.tech_stack = JSON.stringify(entries.tech_stack);
  }
  if ('featured' in entries) {
    entries.featured = entries.featured ? 1 : 0;
  }

  for (const [key, val] of Object.entries(entries)) {
    fields.push(`${key} = ?`);
    values.push(sqlValue(val));
  }
  values.push(id);

  await db.execute({
    sql: `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`,
    args: values,
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
  if (rows.length === 0) return jsonResponse({ error: 'Not found' }, 404);
  const project = { ...rows[0], tech_stack: JSON.parse(rows[0].tech_stack || '[]'), featured: !!rows[0].featured };
  return jsonResponse(project);
}

export async function onRequestDelete({ env, params }) {
  const db = getDb(env);
  await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [params.id] });
  return jsonResponse({ success: true });
}
