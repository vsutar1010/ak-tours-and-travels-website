# Troubleshooting Guide - Deployment Issues

## Issues Fixed

### 1. 405 Method Not Allowed Error on `/api/admin/login`

**Problem:** POST requests to admin login were returning 405 errors.

**Solution Applied:**
- Fixed request body parsing to use `req.text()` then `JSON.parse()` to avoid "body already consumed" errors
- Added proper error handling for body parsing
- Added environment variable validation
- Improved route matching and error message

### 2. MongoDB Connection Not Working

**Problem:** MongoDB connections were failing silently.

**Solution Applied:**
- Added environment variable validation (checks if `MONGODB_URI` is set)
- Improved error messages with detailed connection failure information
- Added connection timeout settings (5s server selection, 45s socket timeout)
- Added console logging for connection attempts and failures

## Steps to Fix Your Deployment

### Step 1: Verify Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and ensure these are set:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
NODE_ENV=production
```

**Important:** 
- Replace `username`, `password`, `cluster`, and `database` with your actual MongoDB Atlas credentials
- Make sure there are no extra spaces or quotes around the values

### Step 2: Check MongoDB Atlas Settings

1. **IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` to allow connections from anywhere (or add Vercel's IP ranges)
   - Click "Add IP Address"

2. **Database User:**
   - Go to MongoDB Atlas → Database Access
   - Ensure your database user has read/write permissions
   - Verify the username and password match what's in `MONGODB_URI`

3. **Connection String:**
   - Go to MongoDB Atlas → Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with your database name (e.g., `aktours`)

### Step 3: Redeploy Your Application

After updating environment variables:

1. **Via Vercel Dashboard:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

2. **Via Git:**
   ```bash
   git add .
   git commit -m "Fix API routes and MongoDB connection"
   git push
   ```

### Step 4: Test the Fixes

1. **Test Admin Login:**
   - Visit: `https://your-domain.vercel.app/admin-login`
   - Try logging in with your admin credentials
   - Check browser console for errors (should be none)

2. **Test API Health:**
   - Visit: `https://your-domain.vercel.app/api/health`
   - Should return: `{"message":"Backend server is running"}`

3. **Test MongoDB Connection:**
   - Try submitting feedback at `/profile`
   - Try viewing feedback at `/feedback`
   - Check Vercel function logs for MongoDB connection messages

### Step 5: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → Functions tab
2. Click on a function (e.g., `api/admin/[...path]`)
3. Check the logs for:
   - "MongoDB connected successfully" (good sign)
   - "MongoDB connection error" (check your MONGODB_URI)
   - "Admin route:" logs (shows route matching)
   - Any error messages

## Common Issues and Solutions

### Issue: "MONGODB_URI is not set"
**Solution:** Add `MONGODB_URI` environment variable in Vercel dashboard

### Issue: "MongoDB connection failed: timeout"
**Solution:** 
- Check MongoDB Atlas cluster is running
- Verify IP whitelist includes `0.0.0.0/0`
- Check connection string format is correct

### Issue: "405 Method Not Allowed"
**Solution:**
- Already fixed in code
- Redeploy the application
- Clear browser cache and try again

### Issue: "Invalid admin credentials"
**Solution:**
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set correctly in Vercel
- Check for extra spaces or special characters
- Try logging in with the exact values from environment variables

## Testing Locally

To test locally before deploying:

```bash
cd frontend/ak-tours-and-travels
npm install
vercel dev
```

Create a `.env.local` file:
```
MONGODB_URI=your-mongodb-connection-string
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-password
NODE_ENV=development
```

## Additional Notes

- The API routes are now using safe body parsing to prevent "body already consumed" errors
- MongoDB connection includes better error messages to help diagnose issues
- All routes now have proper CORS headers
- Function timeouts are set to 30 seconds (Vercel Hobby plan limit)

## Still Having Issues?

1. Check Vercel function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test MongoDB connection string directly using MongoDB Compass or mongo shell
4. Check Vercel deployment logs for build errors
5. Ensure your MongoDB Atlas cluster is not paused (free tier clusters auto-pause after inactivity)



