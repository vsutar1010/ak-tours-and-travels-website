import { corsHeaders, handleCors } from './utils/cors.js';

export default async function handler(req) {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ message: 'Backend server is running' }),
    {
      status: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    }
  );
}
