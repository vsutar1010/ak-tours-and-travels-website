# Fix 500 Errors and CORS Issues

## Problems Fixed

### 1. ✅ CORS Headers on Errors
- Error responses now include CORS headers
- Preflight OPTIONS requests are properly handled
- CORS headers sent even when backend crashes

### 2. ✅ MongoDB Connection for Serverless
- Connection is cached and reused across requests
- Connection is established on-demand for serverless functions
- Better error handling for connection failures
- Connection state checking before database operations

### 3. ✅ Better Error Handling
- Database connection checks before operations
- More descriptive error messages
- Proper HTTP status codes

## Changes Made

### `backend/server.js`
- Improved CORS configuration
- Added connection middleware for serverless functions
- Error handler now sends CORS headers
- Better logging

### `backend/config/db.js`
- Implemented connection caching for serverless
- Added connection state checking
- Better error messages
- Timeout configurations

### `backend/routes/feedback.js`
- Added MongoDB connection check middleware
- Ensures database is connected before operations

### `backend/routes/news.js`
- Added MongoDB connection check middleware
- Ensures database is connected before operations

## What to Check

### 1. Environment Variables in Backend Vercel Project

Go to **Backend Vercel Project** → **Settings** → **Environment Variables**

Make sure these are set:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
NODE_ENV=production
```

### 2. MongoDB Atlas Configuration

1. **IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` to allow all IPs (or specific Vercel IPs)

2. **Database User:**
   - Ensure database user has read/write permissions
   - Check username and password match `MONGODB_URI`

3. **Connection String:**
   - Verify `MONGODB_URI` is correct
   - Should include database name
   - Should have `?retryWrites=true&w=majority` at the end

### 3. Test Backend Directly

Test your backend endpoints:

```bash
# Health check
curl https://ak-tours-backend.vercel.app/api/health

# Should return: {"message":"Backend server is running"}

# Test feedback endpoint
curl https://ak-tours-backend.vercel.app/api/feedback/approved

# Should return: {"success":true,"data":[]} (or with feedbacks)
```

### 4. Check Vercel Function Logs

1. Go to **Backend Vercel Project** → **Deployments**
2. Click on latest deployment
3. Click **"Functions"** tab
4. Check for any errors in logs

Look for:
- MongoDB connection errors
- Environment variable issues
- CORS errors

## Common Issues

### Issue: 500 Internal Server Error

**Possible Causes:**
1. `MONGODB_URI` not set or incorrect
2. MongoDB Atlas IP whitelist blocking Vercel
3. Database user doesn't have permissions
4. Connection string format is wrong

**Solution:**
1. Verify `MONGODB_URI` in Vercel environment variables
2. Check MongoDB Atlas Network Access
3. Test connection string locally
4. Check Vercel function logs

### Issue: CORS Errors

**Possible Causes:**
1. Frontend domain not in allowed origins
2. CORS headers not sent on errors
3. Preflight OPTIONS request failing

**Solution:**
1. Verify frontend domain in `backend/server.js` `allowedOrigins`
2. Check that both `www.aktoursandtravels.info` and `aktoursandtravels.info` are included
3. Redeploy backend after CORS changes

### Issue: Database Connection Timeout

**Possible Causes:**
1. MongoDB Atlas cluster is paused (free tier)
2. Network issues
3. Connection string is wrong

**Solution:**
1. Check MongoDB Atlas cluster status
2. Verify connection string
3. Check Vercel function logs for timeout errors

## After Deploying

1. **Redeploy Backend:**
   - Push changes to GitHub (or manually redeploy in Vercel)
   - Wait for deployment to complete

2. **Test Endpoints:**
   - Health: `https://ak-tours-backend.vercel.app/api/health`
   - Approved feedbacks: `https://ak-tours-backend.vercel.app/api/feedback/approved`
   - Pending feedbacks: `https://ak-tours-backend.vercel.app/api/feedback/pending`

3. **Test from Frontend:**
   - Open `https://www.aktoursandtravels.info`
   - Try admin login
   - Try submitting feedback
   - Check browser console for errors

## Success Indicators

✅ No CORS errors in browser console  
✅ No 500 errors  
✅ Feedback submission works  
✅ Admin dashboard loads feedbacks  
✅ Health endpoint returns success  

## Still Having Issues?

1. **Check Vercel Logs:**
   - Backend project → Deployments → Latest → Functions → Logs

2. **Test MongoDB Connection:**
   ```bash
   # Use MongoDB Compass or mongo shell to test connection string
   mongodb+srv://username:password@cluster.mongodb.net/database
   ```

3. **Check Environment Variables:**
   - Verify all are set for **Production** environment
   - Check for typos in variable names
   - Ensure values are correct

4. **Share Debug Info:**
   - Vercel function logs (screenshot)
   - Browser console errors
   - MongoDB Atlas connection test result

