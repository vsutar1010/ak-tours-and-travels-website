# Debug MongoDB Connection Issues

## Current Error

```
{"error":"Database connection unavailable. Please try again.","details":"MongoDB connection is not established"}
```

## Root Causes to Check

### 1. ✅ Environment Variable Not Set

**Check:** Go to **Backend Vercel Project** → **Settings** → **Environment Variables**

**Must have:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**How to verify:**
1. Go to Vercel Dashboard
2. Select your Backend project
3. Settings → Environment Variables
4. Look for `MONGODB_URI`
5. Make sure it's set for **Production** environment
6. Value should start with `mongodb+srv://`

### 2. ✅ MongoDB Atlas IP Whitelist

**Check:** MongoDB Atlas → Network Access

**Must allow:**
- `0.0.0.0/0` (all IPs) - **Recommended for Vercel**
- Or specific Vercel IP ranges

**How to fix:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
5. Or add specific IPs if you prefer

### 3. ✅ MongoDB Atlas Cluster Status

**Check:** MongoDB Atlas → Clusters

**Must be:**
- Cluster status: **Running** (green)
- Not paused or sleeping

**How to check:**
1. Go to MongoDB Atlas
2. Click **Clusters** (left sidebar)
3. Check cluster status
4. If paused, click **"Resume"**

### 4. ✅ Database User Credentials

**Check:** MongoDB Atlas → Database Access

**Must have:**
- User exists
- Password is correct
- User has read/write permissions
- Username and password match `MONGODB_URI`

**How to verify:**
1. Go to MongoDB Atlas → Database Access
2. Find your database user
3. Click **"Edit"** to see/change password
4. Verify username matches connection string
5. Ensure user has **"Read and write to any database"** or specific database access

### 5. ✅ Connection String Format

**Correct format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Common mistakes:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Wrong username/password
- ❌ Wrong cluster URL
- ❌ Missing database name
- ❌ Missing query parameters

**How to get correct connection string:**
1. Go to MongoDB Atlas → Clusters
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<database>` with your database name (e.g., `aktours`)

### 6. ✅ Vercel Function Logs

**Check:** Backend Vercel Project → Deployments → Latest → Functions → Logs

**Look for:**
- `❌ MONGODB_URI is not set`
- `❌ MongoDB connection error`
- Connection timeout errors
- Authentication errors

**How to check:**
1. Go to Vercel Dashboard
2. Select Backend project
3. Go to **Deployments** tab
4. Click on latest deployment
5. Click **"Functions"** tab
6. Click on a function invocation
7. Check **"Logs"** tab

## Step-by-Step Debugging

### Step 1: Test Connection String Locally

Create a test file `test-connection.js`:

```javascript
const mongoose = require('mongoose');

const mongoURI = 'YOUR_CONNECTION_STRING_HERE';

async function testConnection() {
  try {
    console.log('Testing connection...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
cd backend
node test-connection.js
```

### Step 2: Check Vercel Environment Variables

1. Go to Vercel Dashboard
2. Backend Project → Settings → Environment Variables
3. Verify `MONGODB_URI` is set
4. Check the value (make sure password is correct)
5. Ensure it's enabled for **Production**

### Step 3: Check MongoDB Atlas

1. **Network Access:**
   - Go to Network Access
   - Verify `0.0.0.0/0` is allowed
   - Or add it if missing

2. **Cluster Status:**
   - Go to Clusters
   - Verify cluster is running (not paused)

3. **Database User:**
   - Go to Database Access
   - Verify user exists and has correct permissions

### Step 4: Check Vercel Logs

1. Go to Vercel Dashboard
2. Backend Project → Deployments → Latest
3. Click **Functions** tab
4. Click on a function invocation
5. Check logs for errors

**Common log messages:**
- `❌ MONGODB_URI is not set` → Environment variable missing
- `❌ MongoDB connection error: Authentication failed` → Wrong username/password
- `❌ MongoDB connection error: getaddrinfo ENOTFOUND` → Wrong cluster URL
- `❌ MongoDB connection error: timeout` → Network/IP whitelist issue

## Quick Fix Checklist

- [ ] `MONGODB_URI` is set in Vercel environment variables
- [ ] `MONGODB_URI` is correct format (starts with `mongodb+srv://`)
- [ ] Username and password in connection string are correct
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] MongoDB Atlas cluster is running (not paused)
- [ ] Database user has read/write permissions
- [ ] Backend has been redeployed after setting environment variables
- [ ] Checked Vercel function logs for specific errors

## Test Connection

After fixing, test the connection:

```bash
# Health check (doesn't need DB)
curl https://ak-tours-backend.vercel.app/api/health

# Test feedback endpoint (needs DB)
curl https://ak-tours-backend.vercel.app/api/feedback/approved
```

## Still Not Working?

Share these details:

1. **Vercel Function Logs:**
   - Screenshot of error logs
   - Look for MongoDB connection errors

2. **MongoDB Atlas Status:**
   - Cluster status (running/paused)
   - Network Access settings
   - Database user permissions

3. **Environment Variable:**
   - Is `MONGODB_URI` set? (don't share the actual value)
   - What does it start with? (should be `mongodb+srv://`)

4. **Connection Test:**
   - Does local connection test work?
   - What error does it show?

