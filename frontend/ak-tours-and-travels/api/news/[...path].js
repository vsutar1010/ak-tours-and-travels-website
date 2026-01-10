import connectDB from '../config/db.js';
import News from '../models/News.js';
import { corsHeaders, handleCors } from '../utils/cors.js';

export default async function handler(req) {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  // For catch-all [...path], the path is everything after /api/news/
  const fullPath = url.pathname;
  const pathMatch = fullPath.match(/\/api\/news\/(.+)$/);
  const path = pathMatch ? pathMatch[1] : '';
  const pathParts = path.split('/').filter(p => p);
  const route = pathParts[0] || '';
  const id = pathParts[1] || null;
  const method = req.method;

  try {
    let body = null;
    try {
      body = await req.json();
    } catch (e) {
      // Body might be empty or already read
    }

    // Route: GET /api/news/all
    if (route === 'all' && method === 'GET') {
      await connectDB();
      const news = await News.find()
        .sort({ date: -1 })
        .select('-__v');

      return new Response(
        JSON.stringify({
          success: true,
          data: news,
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: GET /api/news/category/:category
    if (route === 'category' && method === 'GET') {
      await connectDB();
      const category = id;

      if (!['offer', 'update'].includes(category)) {
        return new Response(JSON.stringify({ error: 'Invalid category' }), {
          status: 400,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      const news = await News.find({ category })
        .sort({ date: -1 })
        .select('-__v');

      return new Response(
        JSON.stringify({
          success: true,
          data: news,
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: POST /api/news/add
    if (route === 'add' && method === 'POST') {
      await connectDB();
      const { title, content, category, image } = body || {};

      if (!title || !content || !category) {
        return new Response(
          JSON.stringify({ error: 'Title, content, and category are required' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      if (!['offer', 'update'].includes(category)) {
        return new Response(
          JSON.stringify({ error: 'Category must be "offer" or "update"' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      const news = new News({
        title: title.trim(),
        content: content.trim(),
        category,
        image: image || null,
        date: new Date(),
      });

      await news.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: 'News added successfully',
          news,
        }),
        {
          status: 201,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: PUT /api/news/update/:id
    if (route === 'update' && method === 'PUT') {
      await connectDB();
      const newsId = id;
      const { title, content, category, image } = body || {};

      if (!title || !content || !category) {
        return new Response(
          JSON.stringify({ error: 'Title, content, and category are required' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      if (!['offer', 'update'].includes(category)) {
        return new Response(
          JSON.stringify({ error: 'Category must be "offer" or "update"' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      const news = await News.findByIdAndUpdate(
        newsId,
        {
          title: title.trim(),
          content: content.trim(),
          category,
          image: image || null,
        },
        { new: true }
      );

      if (!news) {
        return new Response(JSON.stringify({ error: 'News not found' }), {
          status: 404,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'News updated successfully',
          news,
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: DELETE /api/news/delete/:id
    if (route === 'delete' && method === 'DELETE') {
      await connectDB();
      const newsId = id;

      const news = await News.findByIdAndDelete(newsId);

      if (!news) {
        return new Response(JSON.stringify({ error: 'News not found' }), {
          status: 404,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'News deleted successfully',
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route not found
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in news handler:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}
