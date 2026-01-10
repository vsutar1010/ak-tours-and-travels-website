# 🚨 QUICK FIX: ERR_NAME_NOT_RESOLVED Error

## The Problem

Your frontend is trying to connect to: `aktoursandtravels.info.api/admin/login`

This is **WRONG** - it's missing the protocol and backend domain.

## ✅ Quick Fix (5 minutes)

### 1. Get Your Backend URL

Go to your **Backend Vercel Project**:
- Dashboard → Deployments → Latest deployment
- Copy the URL (e.g., `https://ak-tours-backend-abc123.vercel.app`)

### 2. Set Environment Variable

Go to your **Frontend Vercel Project**:
1. **Settings** → **Environment Variables**
2. Find `VITE_API_URL` (or create it)
3. Set value to: `https://YOUR-BACKEND-URL.vercel.app/api`
   - Replace `YOUR-BACKEND-URL` with the URL from step 1
   - **MUST include `/api` at the end**

**Example:**
```
VITE_API_URL = https://ak-tours-backend-abc123.vercel.app/api
```

### 3. Redeploy Frontend

1. Go to **Deployments**
2. Click **"..."** on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### 4. Test

1. Open your website
2. Open browser console (F12)
3. You should see:
   ```
   ✅ Using API URL from VITE_API_URL: https://ak-tours-backend-abc123.vercel.app/api
   ```
4. Try to login - it should work now!

## ❌ Common Mistakes

### Wrong:
- `aktoursandtravels.info.api` ❌ (missing https:// and backend domain)
- `https://ak-tours-backend.vercel.app` ❌ (missing /api)
- `ak-tours-backend.vercel.app/api` ❌ (missing https://)

### Correct:
- `https://ak-tours-backend-abc123.vercel.app/api` ✅

## 🔍 Verify Backend is Working

Test your backend directly:

```bash
curl https://YOUR-BACKEND-URL.vercel.app/api/health
```

Should return: `{"message":"Backend server is running"}`

## 📋 Checklist

- [ ] Backend is deployed on Vercel
- [ ] Backend URL copied correctly
- [ ] `VITE_API_URL` set in Frontend Vercel project
- [ ] URL starts with `https://`
- [ ] URL ends with `/api`
- [ ] Frontend redeployed
- [ ] Browser console shows correct URL
- [ ] Login works!

## 🆘 Still Not Working?

1. **Check browser console** - What URL does it show?
2. **Check Vercel logs** - Any errors in function logs?
3. **Test backend directly** - Does `curl` work?
4. **Check CORS** - Is your frontend domain allowed in backend CORS?

See `frontend/ak-tours-and-travels/DEBUG_API_URL.md` for detailed debugging.

