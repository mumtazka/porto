const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

export async function onRequestPost({ env, request }) {
  try {
    const { email, password } = await request.json();
    const adminEmail = env.ADMIN_EMAIL;
    const adminPassword = env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return jsonResponse(
        { error: 'Admin credentials are not configured on the server.' },
        500
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return jsonResponse({ error: 'Invalid email or password.' }, 401);
    }

    return jsonResponse({
      user: {
        email,
        role: 'admin',
        provider: 'turso-admin',
      },
    });
  } catch {
    return jsonResponse({ error: 'Invalid request.' }, 400);
  }
}
