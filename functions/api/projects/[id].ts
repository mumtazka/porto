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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
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

export async function onRequestGet({ env, params }) {
  const db = getDb(env);
  const { rows } = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [params.id] });
  if (rows.length === 0) return jsonResponse({ error: 'Not found' }, 404);
  const project = { ...rows[0], tech_stack: JSON.parse(rows[0].tech_stack || '[]'), featured: !!rows[0].featured };
  return jsonResponse(project);
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
