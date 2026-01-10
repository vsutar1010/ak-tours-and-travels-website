# 🎯 EXACT STEPS TO FIX - Copy & Paste Guide

## Your Current Setup
- ✅ Frontend: `https://aktoursandtravels.info`
- ✅ Backend: `https://ak-tours-backend.vercel.app`
- ❌ Error: `aktoursandtravels.info.api` (WRONG!)

## ✅ SOLUTION: Set Environment Variable Correctly

### Step 1: Go to Frontend Vercel Project

1. Open [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **Frontend Project** (the one with domain `aktoursandtravels.info`)

### Step 2: Add/Update Environment Variable

1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Look for `VITE_API_URL`:
   - **If it exists:** Click the edit icon (pencil) next to it
   - **If it doesn't exist:** Click **"Add New"** button

### Step 3: Set the Correct Value

**Variable Name:**
```
VITE_API_URL
```

**Variable Value:**
```
https://ak-tours-backend.vercel.app/api
```

**Important:**
- ✅ Must start with `https://`
- ✅ Must include full backend URL: `ak-tours-backend.vercel.app`
- ✅ Must end with `/api`
- ❌ NOT `aktoursandtravels.info.api` (this is wrong!)
- ❌ NOT `ak-tours-backend.vercel.app` (missing https:// and /api)

### Step 4: Select Environment

Make sure it's enabled for:
- ✅ **Production** (checked)
- ✅ **Preview** (optional, but recommended)
- ✅ **Development** (optional)

### Step 5: Save

Click **"Save"** or **"Add"** button

### Step 6: Redeploy Frontend

**Option A: Manual Redeploy**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Wait for deployment to complete (2-3 minutes)

**Option B: Trigger by Push**
1. Make a small change to any file (or just commit an empty change)
2. Push to GitHub
3. Vercel will auto-deploy

### Step 7: Verify It Works

1. Open your website: `https://aktoursandtravels.info`
2. Open **Browser Console** (Press F12, then click "Console" tab)
3. You should see:
   ```
   ✅ Using API URL from VITE_API_URL: https://ak-tours-backend.vercel.app/api
   🔗 API Base URL configured: https://ak-tours-backend.vercel.app/api
   🔗 Full example URL: https://ak-tours-backend.vercel.app/api/admin/login
   ```
4. Try to login at `/admin-login` - it should work!

## ❌ What NOT to Set

### Wrong Values (These will cause errors):

```
❌ aktoursandtravels.info.api
❌ https://aktoursandtravels.info/api
❌ ak-tours-backend.vercel.app
❌ https://ak-tours-backend.vercel.app
❌ /api
```

### ✅ Correct Value:

```
✅ https://ak-tours-backend.vercel.app/api
```

## 🔍 How to Verify Backend is Working

Before fixing frontend, test your backend:

1. Open in browser: `https://ak-tours-backend.vercel.app/api/health`
   - Should show: `{"message":"Backend server is running"}`

2. Test admin login endpoint:
   ```bash
   curl -X POST https://ak-tours-backend.vercel.app/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"test"}'
   ```
   - Should return: `{"error":"Invalid admin credentials"}` (not a connection error)

## 📸 Visual Guide

### In Vercel Environment Variables:

```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ Name              Value                 │
├─────────────────────────────────────────┤
│ VITE_API_URL      https://ak-tours-     │
│                   backend.vercel.app/   │
│                   api                   │
└─────────────────────────────────────────┘
```

## 🐛 If Still Not Working

### Check 1: Environment Variable Format
- Open Vercel → Frontend Project → Settings → Environment Variables
- Verify `VITE_API_URL` shows exactly: `https://ak-tours-backend.vercel.app/api`
- No extra spaces, no quotes, no trailing slashes

### Check 2: Redeployment
- Make sure you **redeployed** after setting the variable
- Old deployments don't have the new environment variable

### Check 3: Browser Cache
- Clear browser cache (Ctrl+Shift+Delete)
- Or open in Incognito/Private window
- Or hard refresh (Ctrl+F5)

### Check 4: Backend CORS
- Verify `backend/server.js` includes your frontend domain:
  ```javascript
  const allowedOrigins = [
    'https://www.aktoursandtravels.info',
    'https://aktoursandtravels.info',
    // ...
  ];
  ```

### Check 5: Backend Environment Variables
- Go to **Backend Vercel Project** → Settings → Environment Variables
- Verify these are set:
  - `MONGODB_URI`
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`
  - `NODE_ENV=production`

## ✅ Success Checklist

After following these steps:

- [ ] `VITE_API_URL` is set to `https://ak-tours-backend.vercel.app/api`
- [ ] Frontend has been redeployed
- [ ] Browser console shows correct API URL
- [ ] No `ERR_NAME_NOT_RESOLVED` errors
- [ ] Admin login works
- [ ] Feedback submission works

## 🆘 Still Having Issues?

Share these details:
1. Screenshot of Vercel Environment Variables (hide sensitive values)
2. Browser console output (the API URL logs)
3. Network tab screenshot (showing the failed request)
4. Backend health check result

