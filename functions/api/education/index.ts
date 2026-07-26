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
  const { rows } = await db.execute('SELECT * FROM education ORDER BY start_date DESC');
  return jsonResponse(rows);
}

export async function onRequestPost({ env, request }) {
  const db = getDb(env);
  const body = await request.json();
  const id = generateId();

  await db.execute({
    sql: 'INSERT INTO education (id, institution, degree, field, start_date, end_date, certificate_image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [
      id,
      body.institution,
      body.degree,
      body.field,
      body.start_date,
      body.end_date,
      body.certificate_image || null,
      body.description || null,
    ],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM education WHERE id = ?', args: [id] });
  return jsonResponse(rows[0], 201);
}

export async function onRequestPatch({ env, request, params }) {
  const db = getDb(env);
  const body = await request.json();
  const id = params.id;

  const fields: string[] = [];
  const values: SqlValue[] = [];

  for (const [key, val] of Object.entries(body)) {
    fields.push(`${key} = ?`);
    values.push(sqlValue(val));
  }
  values.push(id);

  await db.execute({
    sql: `UPDATE education SET ${fields.join(', ')} WHERE id = ?`,
    args: values,
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM education WHERE id = ?', args: [id] });
  if (rows.length === 0) return jsonResponse({ error: 'Not found' }, 404);
  return jsonResponse(rows[0]);
}

export async function onRequestDelete({ env, params }) {
  const db = getDb(env);
  await db.execute({ sql: 'DELETE FROM education WHERE id = ?', args: [params.id] });
  return jsonResponse({ success: true });
}
