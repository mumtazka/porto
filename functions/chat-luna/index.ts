const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestOptions() {
  return new Response('ok', { headers: corsHeaders });
}

export async function onRequestPost({ env, request }) {
  try {
    const { userMessage, systemPrompt } = await request.json();
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not set' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser message: ${userMessage}` }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 50,
            topP: 0.95,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    const responseData = await response.json();
    const text =
      responseData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm a bit lost, could you rephrase that? 😅";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
