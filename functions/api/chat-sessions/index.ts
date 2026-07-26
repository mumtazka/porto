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
  const { rows } = await db.execute('SELECT * FROM chat_sessions ORDER BY updated_at DESC');
  const sessions = rows.map((row) => ({
    ...row,
    messages: JSON.parse(row.messages || '[]'),
  }));
  return jsonResponse(sessions);
}

export async function onRequestPost({ env, request }) {
  const db = getDb(env);
  const body = await request.json();
  const id = generateId();

  await db.execute({
    sql: 'INSERT INTO chat_sessions (id, visitor_name, messages) VALUES (?, ?, ?)',
    args: [id, body.visitor_name || null, '[]'],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM chat_sessions WHERE id = ?', args: [id] });
  const session = { ...rows[0], messages: JSON.parse(rows[0].messages || '[]') };
  return jsonResponse(session, 201);
}

export async function onRequestPatch({ env, request, params }) {
  const db = getDb(env);
  const body = await request.json();
  const id = params.id;

  const fields: string[] = [];
  const values: SqlValue[] = [];

  for (const [key, val] of Object.entries(body)) {
    const serializedValue = key === 'messages' ? JSON.stringify(val) : val;
    fields.push(`${key} = ?`);
    values.push(sqlValue(serializedValue));
  }
  values.push(id);

  await db.execute({
    sql: `UPDATE chat_sessions SET ${fields.join(', ')} WHERE id = ?`,
    args: values,
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM chat_sessions WHERE id = ?', args: [id] });
  if (rows.length === 0) return jsonResponse({ error: 'Not found' }, 404);
  const session = { ...rows[0], messages: JSON.parse(rows[0].messages || '[]') };
  return jsonResponse(session);
}

export async function onRequestDelete({ env, params }) {
  const db = getDb(env);
  await db.execute({ sql: 'DELETE FROM chat_sessions WHERE id = ?', args: [params.id] });
  return jsonResponse({ success: true });
}
