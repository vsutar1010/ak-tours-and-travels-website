import connectDB from '../config/db.js';
import Feedback from '../models/Feedback.js';
import { corsHeaders, handleCors } from '../utils/cors.js';

export default async function handler(req) {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  // For catch-all [...path], the path is everything after /api/feedback/
  const fullPath = url.pathname;
  const pathMatch = fullPath.match(/\/api\/feedback\/(.+)$/);
  const path = pathMatch ? pathMatch[1] : '';
  const pathParts = path.split('/').filter(p => p);
  const route = pathParts[0] || '';
  const id = pathParts[1] || null;
  const method = req.method;

  try {
    // Parse request body once (if needed)
    let body = null;
    try {
      body = await req.json();
    } catch (e) {
      // Body might be empty or already read
    }

    // Route: POST /api/feedback/submit
    if (route === 'submit' && method === 'POST') {
      await connectDB();
      const { name, rating, message, tags, media, mediaType } = body || {};

      if (!name || !rating || !message) {
        return new Response(
          JSON.stringify({ error: 'Name, rating, and message are required' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      if (rating < 1 || rating > 5) {
        return new Response(
          JSON.stringify({ error: 'Rating must be between 1 and 5' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      const feedback = new Feedback({
        name: name.trim(),
        rating: Number(rating),
        message: message.trim(),
        tags: tags || [],
        media: media || null,
        mediaType: mediaType || null,
        approved: false,
      });

      await feedback.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Feedback submitted successfully and is pending admin approval',
          feedback,
        }),
        {
          status: 201,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: GET /api/feedback/approved
    if (route === 'approved' && method === 'GET') {
      await connectDB();
      const approvedFeedbacks = await Feedback.find({ approved: true })
        .sort({ approvedAt: -1 })
        .select('-approvedBy -__v');

      return new Response(
        JSON.stringify({
          success: true,
          data: approvedFeedbacks,
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: GET /api/feedback/pending
    if (route === 'pending' && method === 'GET') {
      await connectDB();
      const pendingFeedbacks = await Feedback.find({ approved: false })
        .sort({ createdAt: -1 });

      return new Response(
        JSON.stringify({
          success: true,
          data: pendingFeedbacks,
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: PUT /api/feedback/approve/:id
    if (route === 'approve' && method === 'PUT') {
      await connectDB();
      const feedbackId = id || (body?.feedbackId);
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Feedback ID is required' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      const feedback = await Feedback.findByIdAndUpdate(
        feedbackId,
        {
          approved: true,
          approvedBy: 'admin',
          approvedAt: new Date(),
        },
        { new: true }
      );

      if (!feedback) {
        return new Response(JSON.stringify({ error: 'Feedback not found' }), {
          status: 404,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Feedback approved successfully',
          feedback,
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: DELETE /api/feedback/reject/:id
    if (route === 'reject' && method === 'DELETE') {
      await connectDB();
      const feedbackId = id || (body?.feedbackId);
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Feedback ID is required' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      const feedback = await Feedback.findByIdAndDelete(feedbackId);

      if (!feedback) {
        return new Response(JSON.stringify({ error: 'Feedback not found' }), {
          status: 404,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Feedback rejected and deleted',
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: DELETE /api/feedback/delete/:id
    if (route === 'delete' && method === 'DELETE') {
      await connectDB();
      const feedbackId = id || (body?.feedbackId);
      
      if (!feedbackId) {
        return new Response(
          JSON.stringify({ error: 'Feedback ID is required' }),
          {
            status: 400,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          }
        );
      }

      const feedback = await Feedback.findByIdAndDelete(feedbackId);

      if (!feedback) {
        return new Response(JSON.stringify({ error: 'Feedback not found' }), {
          status: 404,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Feedback deleted successfully',
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
    console.error('Error in feedback handler:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}
