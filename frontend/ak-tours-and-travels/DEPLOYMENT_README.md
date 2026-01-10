# Deployment Ready - Vercel Configuration

Your website is now ready for Vercel deployment! The backend has been converted to Vercel serverless functions.

## Quick Start

1. **Set up MongoDB Atlas** (if not already done)
   - Create account at mongodb.com/cloud/atlas
   - Create cluster and database
   - Get connection string

2. **Deploy to Vercel**
   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Vercel dashboard
   - Set root directory to: `frontend/ak-tours-and-travels`
   - Add environment variables (see below)

3. **Environment Variables** (add in Vercel dashboard):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-admin-password
   NODE_ENV=production
   ```

## What Changed

✅ Backend converted to Vercel serverless functions in `/api` folder
✅ Frontend updated to use relative API paths (`/api`)
✅ MongoDB connection optimized for serverless (cached)
✅ CORS handling configured
✅ All API routes migrated

## Project Structure

```
frontend/ak-tours-and-travels/
├── api/              # Serverless functions (your backend)
│   ├── config/       # Database config
│   ├── models/       # Mongoose models
│   ├── utils/        # Utilities (CORS, etc.)
│   ├── feedback/     # Feedback endpoints
│   ├── admin/        # Admin endpoints
│   └── news/         # News endpoints
├── src/              # React frontend
└── vercel.json       # Vercel config
```

## API Endpoints

All endpoints are at `/api/*`:
- `/api/health` - Health check
- `/api/feedback/*` - Feedback management
- `/api/admin/*` - Admin authentication
- `/api/news/*` - News/offers management

See `VERCEL_DEPLOYMENT.md` for detailed documentation.
