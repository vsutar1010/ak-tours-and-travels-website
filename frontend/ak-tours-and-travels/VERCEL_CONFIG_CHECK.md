# Critical Vercel Configuration Check

## ⚠️ IMPORTANT: Verify These Settings in Vercel Dashboard

The 405 errors suggest API routes aren't being recognized. Please verify these settings:

### 1. Root Directory (CRITICAL)

**Go to:** Vercel Dashboard → Your Project → Settings → General → Root Directory

**Must be set to:** `frontend/ak-tours-and-travels`

**Why:** If this is wrong, Vercel won't see your `api/` folder and will return 405 errors.

**How to fix:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → General
4. Scroll to "Root Directory"
5. Set it to: `frontend/ak-tours-and-travels`
6. Click "Save"
7. **Redeploy** (go to Deployments → Click "Redeploy" on latest deployment)

### 2. Framework Preset

**Should be:** Vite (or "Other" if Vite isn't available)

### 3. Build Command

**Should be:** `npm run build`

### 4. Output Directory

**Should be:** `dist`

### 5. Install Command

**Should be:** `npm install`

### 6. Environment Variables

Verify these are set (Settings → Environment Variables):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
NODE_ENV=production
```

**Important:** 
- Make sure they're set for **Production** environment
- No quotes or extra spaces
- After adding/changing, **redeploy**

### 7. Check Function Logs

After redeploying, check if API routes are being called:

1. Go to Vercel Dashboard → Your Project → Functions tab
2. Click on `api/admin/[...path]`
3. Check the logs when you try to login
4. You should see: `"Admin handler called:"` logs

**If you don't see any logs**, the function isn't being called, which means:
- Root directory is wrong, OR
- API routes aren't being deployed

### 8. Test API Health Endpoint

Visit: `https://www.aktoursandtravels.info/api/health`

**Expected:** `{"message":"Backend server is running"}`

**If you get 405 or HTML:** Root directory is definitely wrong

### 9. Verify API Folder Structure

In Vercel, after deployment, check:
- Go to Deployments → Latest deployment → View Build Logs
- Look for: `api/admin/[...path].js` in the function list
- If you don't see it, the root directory is wrong

### 10. Common Issues

**Issue:** "API routes return 405"
- **Solution:** Check root directory is `frontend/ak-tours-and-travels`

**Issue:** "API routes return HTML"
- **Solution:** Root directory is wrong OR rewrite rules are interfering

**Issue:** "Functions tab shows no functions"
- **Solution:** Root directory is definitely wrong

## Quick Fix Steps

1. ✅ Verify root directory = `frontend/ak-tours-and-travels`
2. ✅ Verify environment variables are set
3. ✅ Redeploy the project
4. ✅ Test `/api/health` endpoint
5. ✅ Check function logs

## Still Not Working?

If after checking all of the above it still doesn't work:

1. **Check Vercel Build Logs:**
   - Go to Deployments → Latest → View Build Logs
   - Look for errors about API routes

2. **Check Function Logs:**
   - Go to Functions tab
   - Click on a function
   - See if there are any errors

3. **Try creating a simple test function:**
   - Create `api/test.js`:
   ```js
   export default async function handler(req) {
     return new Response(JSON.stringify({ message: 'Test works' }), {
       status: 200,
       headers: { 'Content-Type': 'application/json' },
     });
   }
   ```
   - Deploy and test: `https://your-domain.vercel.app/api/test`
   - If this doesn't work, root directory is definitely wrong



