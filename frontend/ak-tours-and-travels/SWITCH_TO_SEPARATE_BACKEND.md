# Switch to Separate Backend Deployment

This guide explains how to switch from Vercel serverless functions to a separate backend deployment.

## Why Switch?

✅ **No Function Limits:** Vercel Hobby plan has 12 function limit  
✅ **Easier Debugging:** Separate logs for frontend and backend  
✅ **Standard Express:** Use familiar Express.js patterns  
✅ **Better Performance:** No cold starts  
✅ **Independent Scaling:** Scale frontend and backend separately  

## Quick Start

### Step 1: Deploy Backend Separately

Follow the guide in `backend/DEPLOY_TO_VERCEL.md` to deploy your backend as a separate Vercel project.

You'll get a URL like: `https://ak-tours-backend.vercel.app`

### Step 2: Update Frontend Environment Variable

1. **Go to Frontend Vercel Project:**
   - Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

2. **Add/Update Environment Variable:**
   ```
   VITE_API_URL=https://ak-tours-backend.vercel.app/api
   ```
   ⚠️ **Important:** Make sure it's set for **Production** environment

3. **Redeploy Frontend:**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or push a new commit

### Step 3: Remove Serverless Functions (Optional)

If you want to clean up and remove the serverless functions:

1. **Delete the `api/` folder** from `frontend/ak-tours-and-travels/`
2. **Update `vercel.json`** to remove function configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Remove serverless functions, use separate backend"
   git push
   ```

## Configuration

### Backend CORS

The backend is already configured to allow your frontend domain. Check `backend/server.js`:

```javascript
const allowedOrigins = [
  'https://www.aktoursandtravels.info',
  'https://aktoursandtravels.info',
  'http://localhost:5173', // Vite dev server
  // ... add more if needed
];
```

### Frontend API URL

The frontend automatically uses `VITE_API_URL` if set, otherwise falls back to `/api` (serverless functions).

See `frontend/ak-tours-and-travels/src/utils/api.js` for details.

## Testing

### 1. Test Backend Health
```
https://ak-tours-backend.vercel.app/api/health
```
Should return: `{"message":"Backend server is running"}`

### 2. Test Frontend
- Visit: `https://www.aktoursandtravels.info`
- Try admin login
- Submit feedback
- Check browser console for errors

### 3. Check CORS
If you see CORS errors:
- Verify frontend URL is in `allowedOrigins` in `backend/server.js`
- Check that `VITE_API_URL` is set correctly
- Make sure both are using HTTPS in production

## Rollback Plan

If something goes wrong, you can rollback:

1. **Remove `VITE_API_URL`** environment variable from frontend
2. **Redeploy frontend** - it will use `/api` (serverless functions)
3. **Keep backend deployed** - it won't interfere

## Comparison

### Before (Serverless Functions)
- ✅ Everything in one project
- ❌ Function limit (12 functions)
- ❌ More complex routing
- ❌ Cold starts

### After (Separate Backend)
- ✅ No function limits
- ✅ Standard Express.js
- ✅ Better performance
- ✅ Easier debugging
- ❌ Two projects to manage
- ❌ Need to configure CORS

## Next Steps

1. ✅ Deploy backend separately
2. ✅ Update frontend `VITE_API_URL`
3. ✅ Test all functionality
4. ✅ Monitor logs
5. ✅ (Optional) Remove serverless functions

## Need Help?

- Check `backend/DEPLOY_TO_VERCEL.md` for deployment guide
- Check `DEPLOYMENT_OPTIONS.md` for alternative platforms
- Review CORS configuration in `backend/server.js`
- Check Vercel function logs for errors


