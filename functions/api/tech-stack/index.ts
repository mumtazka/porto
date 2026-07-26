import { createClient } from '@libsql/client/web';

function getDb(env) {
  return createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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
  const { rows } = await db.execute('SELECT * FROM tech_stack ORDER BY id');
  return jsonResponse(rows);
}
