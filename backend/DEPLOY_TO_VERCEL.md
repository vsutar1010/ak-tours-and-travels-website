# Deploy Backend Separately on Vercel

This guide will help you deploy your Express.js backend as a separate Vercel project.

## Prerequisites

- Vercel account
- MongoDB Atlas database
- Git repository

## Step 1: Prepare Backend

The backend is already prepared with:
- ✅ `vercel.json` configuration file
- ✅ CORS configuration for your frontend domain
- ✅ Serverless-compatible Express setup

## Step 2: Deploy via Vercel Dashboard

### Option A: Deploy from GitHub

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"

2. **Select Your Repository**
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name:** `ak-tours-backend` (or your preferred name)
   - **Root Directory:** `backend` ⚠️ **IMPORTANT: Set this to `backend`**
   - **Framework Preset:** Other
   - **Build Command:** Leave empty (not needed for Node.js)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-admin-password
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://ak-tours-backend.vercel.app`)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Set root directory to current directory (`.`)
   - Add environment variables when prompted

5. **Add Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add ADMIN_USERNAME
   vercel env add ADMIN_PASSWORD
   vercel env add NODE_ENV production
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Update Frontend API URL

After deploying, you'll get a backend URL like:
- `https://ak-tours-backend.vercel.app`

### Update Frontend Configuration

1. **Update `frontend/ak-tours-and-travels/src/utils/api.js`:**

```javascript
// Get API URL from environment or use default
const getApiBaseUrl = () => {
  // In production, use the backend Vercel URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to your backend Vercel URL
  return 'https://ak-tours-backend.vercel.app/api';
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
```

2. **Add Environment Variable in Frontend Vercel Project:**
   - Go to Frontend Vercel Project → Settings → Environment Variables
   - Add: `VITE_API_URL=https://ak-tours-backend.vercel.app/api`
   - Redeploy frontend

## Step 4: Test the Deployment

1. **Test Health Endpoint:**
   ```
   https://ak-tours-backend.vercel.app/api/health
   ```
   Should return: `{"message":"Backend server is running"}`

2. **Test Admin Login:**
   - Visit your frontend: `https://www.aktoursandtravels.info/admin-login`
   - Try logging in
   - Check browser console for errors

3. **Test Feedback Submission:**
   - Visit: `https://www.aktoursandtravels.info/profile`
   - Submit feedback
   - Check if it appears in admin dashboard

## Step 5: Configure Custom Domain (Optional)

If you want a custom domain for your backend:

1. Go to Vercel Dashboard → Your Backend Project → Settings → Domains
2. Add your domain (e.g., `api.aktoursandtravels.info`)
3. Update DNS records as instructed
4. Update frontend `VITE_API_URL` to use the new domain

## Troubleshooting

### Issue: "Cannot GET /"
**Solution:** Make sure `vercel.json` is in the `backend/` folder and root directory is set to `backend`

### Issue: CORS Errors
**Solution:** 
- Check `backend/server.js` has your frontend domain in `allowedOrigins`
- Verify frontend URL matches exactly (including `https://`)

### Issue: MongoDB Connection Fails
**Solution:**
- Verify `MONGODB_URI` environment variable is set correctly
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### Issue: Environment Variables Not Working
**Solution:**
- Make sure environment variables are set for **Production** environment
- Redeploy after adding/changing environment variables
- Check variable names match exactly (case-sensitive)

## Project Structure

```
your-repo/
├── backend/              ← Backend project (deploy this separately)
│   ├── vercel.json      ← Vercel configuration
│   ├── server.js        ← Express server
│   ├── package.json
│   └── ...
└── frontend/
    └── ak-tours-and-travels/  ← Frontend project (already deployed)
        ├── vercel.json
        └── ...
```

## Benefits of Separate Deployment

✅ **Easier Debugging:** Separate logs for frontend and backend  
✅ **Independent Scaling:** Scale frontend and backend separately  
✅ **No Function Limits:** No Vercel serverless function limits  
✅ **Standard Express:** Use standard Express.js patterns  
✅ **Better Performance:** No cold starts for backend  
✅ **Easier Maintenance:** Clear separation of concerns  

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Update frontend API URL
3. ✅ Test all endpoints
4. ✅ Monitor logs for any issues
5. ✅ Set up custom domain (optional)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check function logs in Vercel dashboard
3. Test API endpoints with Postman/curl
4. Verify environment variables
5. Check CORS configuration


