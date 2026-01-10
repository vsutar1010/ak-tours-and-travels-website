# Troubleshooting Summary: ERR_NAME_NOT_RESOLVED

## 🔴 Root Cause

The error `ERR_NAME_NOT_RESOLVED` with URL `aktoursandtravels.info.api/admin/login` indicates that:

1. **`VITE_API_URL` environment variable is set incorrectly** in your Frontend Vercel project
2. The value is likely set to `aktoursandtravels.info.api` instead of the full backend URL

## ✅ Solution

### Step 1: Get Backend URL

1. Go to **Backend Vercel Project** dashboard
2. Copy the production URL (e.g., `https://ak-tours-backend-xyz.vercel.app`)

### Step 2: Configure Frontend

1. Go to **Frontend Vercel Project** → **Settings** → **Environment Variables**
2. Set `VITE_API_URL` to: `https://YOUR-BACKEND-URL.vercel.app/api`
   - **Must include:** `https://` protocol
   - **Must include:** Full backend domain
   - **Must include:** `/api` suffix (matches backend route prefix)

### Step 3: Redeploy

Redeploy your frontend after setting the environment variable.

## 🔍 Debugging Tools Added

### 1. Enhanced API Configuration (`src/utils/api.js`)

- ✅ URL validation
- ✅ Console logging (shows configured URL)
- ✅ Error detection for malformed URLs
- ✅ Works in both dev and production

### 2. Improved Error Handling (`src/pages/AdminLogin.jsx`)

- ✅ Better error messages
- ✅ Detects network errors
- ✅ Detects CORS errors
- ✅ Shows helpful debugging info

### 3. Debugging Guides

- `QUICK_FIX_API_URL.md` - Quick 5-minute fix guide
- `frontend/ak-tours-and-travels/DEBUG_API_URL.md` - Detailed debugging guide

## 📋 Verification Steps

### 1. Check Browser Console

After redeploying, open browser console. You should see:

```
✅ Using API URL from VITE_API_URL: https://ak-tours-backend-xyz.vercel.app/api
🔗 API Base URL configured: https://ak-tours-backend-xyz.vercel.app/api
🔗 Full example URL: https://ak-tours-backend-xyz.vercel.app/api/admin/login
```

### 2. Test Backend Directly

```bash
curl https://YOUR-BACKEND-URL.vercel.app/api/health
```

Should return: `{"message":"Backend server is running"}`

### 3. Test Admin Login Endpoint

```bash
curl -X POST https://YOUR-BACKEND-URL.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

Should return: `{"error":"Invalid admin credentials"}` (not a connection error)

### 4. Check CORS Configuration

Verify `backend/server.js` includes your frontend domain in `allowedOrigins`:

```javascript
const allowedOrigins = [
  'https://www.aktoursandtravels.info',
  'https://aktoursandtravels.info',
  // ... other origins
];
```

## 🐛 Common Issues

### Issue 1: Wrong URL Format

**Symptom:** `ERR_NAME_NOT_RESOLVED` with malformed URL

**Fix:** Ensure `VITE_API_URL` is:
- ✅ `https://backend-url.vercel.app/api`
- ❌ NOT `backend-url.vercel.app/api` (missing protocol)
- ❌ NOT `https://backend-url.vercel.app` (missing /api)
- ❌ NOT `aktoursandtravels.info.api` (completely wrong)

### Issue 2: CORS Errors

**Symptom:** `CORS policy` errors in console

**Fix:** 
1. Check `backend/server.js` CORS configuration
2. Ensure frontend domain is in `allowedOrigins`
3. Redeploy backend after CORS changes

### Issue 3: Backend Not Responding

**Symptom:** Timeout or connection refused

**Fix:**
1. Check backend Vercel deployment status
2. Check backend function logs in Vercel
3. Verify MongoDB connection (check `MONGODB_URI` in backend)
4. Test backend health endpoint directly

### Issue 4: 401 Unauthorized

**Symptom:** Login fails with "Invalid credentials"

**Fix:**
1. Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` in backend environment variables
2. Verify credentials match what you're using to login

## 📞 What to Share for Help

If you need more help, share:

1. **Backend URL:** `https://...`
2. **Frontend URL:** `https://...`
3. **Browser Console Output:** Copy the API URL logs
4. **Vercel Environment Variables:** (screenshot, hide sensitive values)
5. **Error Message:** Full error from browser console
6. **Network Tab:** Screenshot of failed request

## ✅ Success Criteria

You'll know it's fixed when:

- ✅ Browser console shows correct API URL
- ✅ No `ERR_NAME_NOT_RESOLVED` errors
- ✅ Admin login works
- ✅ Feedback submission works
- ✅ News fetching works

## 📚 Related Files

- `QUICK_FIX_API_URL.md` - Quick fix guide
- `frontend/ak-tours-and-travels/DEBUG_API_URL.md` - Detailed guide
- `frontend/ak-tours-and-travels/src/utils/api.js` - API configuration
- `backend/server.js` - Backend CORS configuration
- `backend/DEPLOY_TO_VERCEL.md` - Backend deployment guide

