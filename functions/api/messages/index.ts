import { createClient } from '@libsql/client/web';

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
  const { rows } = await db.execute('SELECT * FROM messages ORDER BY created_at DESC');
  return jsonResponse(rows);
}

export async function onRequestPost({ env, request }) {
  const db = getDb(env);
  const body = await request.json();
  const id = generateId();

  await db.execute({
    sql: 'INSERT INTO messages (id, name, email, message) VALUES (?, ?, ?, ?)',
    args: [id, body.name, body.email, body.message],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM messages WHERE id = ?', args: [id] });
  return jsonResponse(rows[0], 201);
}

export async function onRequestDelete({ env, params }) {
  const db = getDb(env);
  await db.execute({ sql: 'DELETE FROM messages WHERE id = ?', args: [params.id] });
  return jsonResponse({ success: true });
}
