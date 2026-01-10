import { corsHeaders, handleCors } from '../utils/cors.js';

export default async function handler(req) {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  // For catch-all [...path], the path is everything after /api/admin/
  const fullPath = url.pathname;
  const pathMatch = fullPath.match(/\/api\/admin\/(.+)$/);
  const path = pathMatch ? pathMatch[1] : '';
  const route = path.split('/')[0] || '';
  const method = req.method;

  try {
    // Route: POST /api/admin/login
    if (route === 'login' && method === 'POST') {
      const body = await req.json();
      const { username, password } = body;

      if (!username || !password) {
        return new Response(
          JSON.stringify({ error: 'Username and password are required' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Admin logged in successfully',
            token: 'admin-token-' + Date.now(),
          }),
          {
            status: 200,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'Invalid admin credentials' }),
          {
            status: 401,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Route not found
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in admin handler:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}
