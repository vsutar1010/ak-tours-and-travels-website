# Vercel Deployment Guide

This guide will help you deploy your AK Tours & Travels website to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A MongoDB database (MongoDB Atlas recommended)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your MongoDB Database

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist IP addresses (add `0.0.0.0/0` for Vercel deployment)
5. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the repository containing your project

3. **Configure Project Settings**
   - **Root Directory**: Set to `frontend/ak-tours-and-travels`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   - `MONGODB_URI` - Your MongoDB connection string
   - `ADMIN_USERNAME` - Your admin login username
   - `ADMIN_PASSWORD` - Your admin login password
   - `NODE_ENV` - Set to `production`

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to project directory**
   ```bash
   cd frontend/ak-tours-and-travels
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Add Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add ADMIN_USERNAME
   vercel env add ADMIN_PASSWORD
   vercel env add NODE_ENV production
   ```

6. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Test the API health endpoint: `https://your-project.vercel.app/api/health`
3. Test admin login at `/admin-login`
4. Test feedback submission at `/profile`
5. Test news/offers display at `/latest-news`

## Project Structure

```
frontend/ak-tours-and-travels/
├── api/                    # Serverless functions (backend)
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/            # Mongoose models
│   ├── utils/             # Utility functions
│   ├── feedback/          # Feedback API routes
│   ├── admin/             # Admin API routes
│   └── news/              # News API routes
├── src/                   # React frontend
├── public/                # Static assets
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## API Routes

All API routes are available at `/api/*`:

- `GET /api/health` - Health check
- `POST /api/feedback/submit` - Submit feedback
- `GET /api/feedback/approved` - Get approved feedbacks
- `GET /api/feedback/pending` - Get pending feedbacks (admin)
- `PUT /api/feedback/approve/[id]` - Approve feedback (admin)
- `DELETE /api/feedback/reject/[id]` - Reject feedback (admin)
- `DELETE /api/feedback/delete/[id]` - Delete feedback (admin)
- `POST /api/admin/login` - Admin login
- `GET /api/news/all` - Get all news
- `GET /api/news/category/[category]` - Get news by category
- `POST /api/news/add` - Add news (admin)
- `PUT /api/news/update/[id]` - Update news (admin)
- `DELETE /api/news/delete/[id]` - Delete news (admin)

## Environment Variables

Required environment variables in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `ADMIN_USERNAME` | Admin login username | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | `secure-password` |
| `NODE_ENV` | Environment | `production` |

## Troubleshooting

### Build Errors

1. **Module not found errors**
   - Ensure all dependencies are in `package.json`
   - Run `npm install` locally to verify

2. **MongoDB connection errors**
   - Verify `MONGODB_URI` is set correctly
   - Check MongoDB Atlas IP whitelist includes Vercel IPs
   - Ensure database user has correct permissions

3. **API routes not working**
   - Check that files in `/api` folder are using ES modules (`import/export`)
   - Verify `vercel.json` configuration
   - Check Vercel function logs in dashboard

### Runtime Errors

1. **CORS errors**
   - CORS is handled in `api/utils/cors.js`
   - Verify CORS headers are being set correctly

2. **Database connection timeouts**
   - MongoDB connection is cached for serverless functions
   - Check MongoDB Atlas connection limits
   - Verify connection string format

## Custom Domain

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

## Monitoring

- View function logs in Vercel dashboard
- Monitor API usage in Vercel Analytics
- Set up error tracking (optional)

## Local Development

For local development with Vercel:

```bash
cd frontend/ak-tours-and-travels
npm install
vercel dev
```

This will:
- Run your frontend on `http://localhost:3000`
- Run API routes as serverless functions
- Use environment variables from `.env.local`

## Notes

- The backend Express server is converted to Vercel serverless functions
- All API routes are in the `/api` folder
- MongoDB connection is cached for better performance
- Frontend uses relative API paths (`/api`) for production

## Support

For issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection status
