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
  const { rows } = await db.execute('SELECT * FROM personal_context LIMIT 1');
  if (rows.length === 0) return jsonResponse(null);
  return jsonResponse(rows[0]);
}

export async function onRequestPost({ env, request }) {
  const db = getDb(env);
  const body = await request.json();

  const { rows } = await db.execute('SELECT id FROM personal_context LIMIT 1');
  if (rows.length > 0) {
    const id = rows[0].id;
    const fields: string[] = [];
    const values: SqlValue[] = [];

    for (const [key, val] of Object.entries(body)) {
      fields.push(`${key} = ?`);
      values.push(sqlValue(val));
    }
    values.push(id);

    await db.execute({
      sql: `UPDATE personal_context SET ${fields.join(', ')} WHERE id = ?`,
      args: values,
    });

    const { rows: updated } = await db.execute({ sql: 'SELECT * FROM personal_context WHERE id = ?', args: [id] });
    return jsonResponse(updated[0]);
  }

  const columns = Object.keys(body);
  const placeholders = columns.map(() => '?').join(', ');
  const values = Object.values(body);

  await db.execute({
    sql: `INSERT INTO personal_context (${columns.join(', ')}) VALUES (${placeholders})`,
    args: values,
  });

  const { rows: inserted } = await db.execute('SELECT * FROM personal_context LIMIT 1');
  return jsonResponse(inserted[0], 201);
}
