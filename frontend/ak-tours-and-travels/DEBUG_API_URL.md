# Debugging API URL Configuration

## 🔴 Current Error

```
ERR_NAME_NOT_RESOLVED
aktoursandtravels.info.api/admin/login
```

This error means the `VITE_API_URL` environment variable is set incorrectly in Vercel.

## ✅ Correct Configuration

### Step 1: Get Your Backend URL

1. Go to your **Backend Vercel Project** dashboard
2. Go to **Deployments** tab
3. Click on the latest deployment
4. Copy the **Production URL** (e.g., `https://ak-tours-backend.vercel.app`)

### Step 2: Set Environment Variable in Frontend Vercel Project

1. Go to your **Frontend Vercel Project** dashboard
2. Go to **Settings** → **Environment Variables**
3. Find or add: `VITE_API_URL`
4. Set the value to: `https://YOUR-BACKEND-URL.vercel.app/api`
   - Replace `YOUR-BACKEND-URL` with your actual backend URL
   - **IMPORTANT:** Include `/api` at the end
   - **Example:** `https://ak-tours-backend.vercel.app/api`

### Step 3: Verify the Format

The URL should:
- ✅ Start with `https://` or `http://`
- ✅ Include the full domain (e.g., `ak-tours-backend.vercel.app`)
- ✅ End with `/api` (matching your backend route prefix)
- ❌ **NOT** be just `aktoursandtravels.info.api` (missing protocol and domain)

### Step 4: Redeploy

1. After setting the environment variable, **Redeploy** your frontend
2. Go to **Deployments** → Click **"..."** on latest deployment → **Redeploy**
3. Or push a new commit to trigger auto-deploy

## 🔍 How to Check Current Configuration

### In Browser Console

Open your website and check the browser console. You should see:

```
✅ Using API URL from VITE_API_URL: https://ak-tours-backend.vercel.app/api
🔗 API Base URL configured: https://ak-tours-backend.vercel.app/api
🔗 Full example URL: https://ak-tours-backend.vercel.app/api/admin/login
```

### If You See Errors

If you see:
```
❌ Invalid API URL format: aktoursandtravels.info.api
```

This means `VITE_API_URL` is set incorrectly. Fix it using Step 2 above.

## 🧪 Test Your Backend

Before configuring the frontend, test your backend directly:

```bash
# Test health endpoint
curl https://YOUR-BACKEND-URL.vercel.app/api/health

# Test admin login (should return 400 without credentials, but should connect)
curl -X POST https://YOUR-BACKEND-URL.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

If these work, your backend is fine. The issue is the frontend configuration.

## 📋 Checklist

- [ ] Backend is deployed and accessible
- [ ] Backend URL is correct (test with curl)
- [ ] `VITE_API_URL` is set in Frontend Vercel project
- [ ] `VITE_API_URL` starts with `https://` or `http://`
- [ ] `VITE_API_URL` includes `/api` at the end
- [ ] Frontend has been redeployed after setting the variable
- [ ] Browser console shows correct API URL
- [ ] CORS is configured in backend (allows your frontend domain)

## 🐛 Common Mistakes

### ❌ Wrong: `aktoursandtravels.info.api`
- Missing protocol (`https://`)
- Missing backend domain
- This creates invalid URLs like `aktoursandtravels.info.api/admin/login`

### ❌ Wrong: `https://ak-tours-backend.vercel.app`
- Missing `/api` suffix
- Backend routes are at `/api/admin/login`, not `/admin/login`

### ✅ Correct: `https://ak-tours-backend.vercel.app/api`
- Full URL with protocol
- Includes `/api` to match backend route prefix

## 🔄 Alternative: Use Relative Path

If you want to use Vercel serverless functions instead:

1. **Remove** `VITE_API_URL` from environment variables (or set it to empty)
2. The frontend will use `/api` (relative path)
3. Make sure your `/api` folder has serverless functions

## 📞 Need More Help?

1. Check Vercel function logs:
   - Frontend project → Deployments → Latest → Functions tab
   - Backend project → Deployments → Latest → Functions tab

2. Check browser Network tab:
   - Open DevTools → Network
   - Try to login
   - See what URL is actually being called

3. Share these details:
   - Backend Vercel URL
   - Frontend Vercel URL
   - What you see in browser console
   - Screenshot of Vercel environment variables (hide sensitive values)

