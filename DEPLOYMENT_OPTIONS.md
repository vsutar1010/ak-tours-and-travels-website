# Deployment Options for AK Tours & Travels

## Overview

You have several options for deploying your backend and frontend. This guide covers all alternatives to Vercel serverless functions.

---

## Option 1: Deploy Backend Separately on Vercel (Recommended)

### ✅ Pros
- Keep everything on Vercel (familiar platform)
- Separate deployments (frontend and backend)
- Better for debugging and scaling
- No serverless function limits
- Standard Express.js (easier to maintain)

### ❌ Cons
- Two separate projects to manage
- Need to configure CORS properly
- Slightly more complex setup

### How to Deploy Backend on Vercel

#### Step 1: Prepare Backend for Vercel

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Step 2: Update Backend CORS Configuration

Update `backend/server.js` to allow your frontend domain:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// CORS configuration - allow your frontend domain
const corsOptions = {
  origin: [
    'https://www.aktoursandtravels.info',
    'https://aktoursandtravels.info',
    'http://localhost:5173', // For local development
    'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ... rest of your code
```

#### Step 3: Deploy Backend to Vercel

1. **Create a new Vercel project for backend:**
   ```bash
   cd backend
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Root Directory:**
   - In Vercel Dashboard → Settings → General
   - Set Root Directory to: `backend`

3. **Add Environment Variables:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `ADMIN_USERNAME` - Admin username
   - `ADMIN_PASSWORD` - Admin password
   - `NODE_ENV` - `production`
   - `PORT` - (optional, Vercel handles this)

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Get Backend URL:**
   - Vercel will give you a URL like: `https://ak-tours-backend.vercel.app`
   - Or use your custom domain

#### Step 4: Update Frontend to Use Backend URL

Update `frontend/ak-tours-and-travels/src/utils/api.js`:

```javascript
// For production, use your backend Vercel URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  'https://ak-tours-backend.vercel.app/api';

export default API_BASE_URL;
```

Add to `.env` or Vercel environment variables:
```
VITE_API_URL=https://ak-tours-backend.vercel.app/api
```

---

## Option 2: Railway (Great Alternative)

### ✅ Pros
- Free tier available
- Easy deployment
- Automatic HTTPS
- Good for Node.js apps
- Simple setup

### ❌ Cons
- Free tier has limits
- May need to upgrade for production

### How to Deploy on Railway

1. **Sign up:** [railway.app](https://railway.app)
2. **Create new project** → "Deploy from GitHub repo"
3. **Select backend folder** or set root directory to `backend`
4. **Add environment variables:**
   - `MONGODB_URI`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `PORT` (Railway provides this automatically)
5. **Deploy** - Railway auto-detects Node.js and deploys
6. **Get URL:** Railway provides a URL like `https://your-app.railway.app`

**Update CORS in `backend/server.js`:**
```javascript
const corsOptions = {
  origin: [
    'https://www.aktoursandtravels.info',
    'https://your-app.railway.app'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

---

## Option 3: Render

### ✅ Pros
- Free tier with limitations
- Easy setup
- Auto-deploy from GitHub
- Good documentation

### ❌ Cons
- Free tier spins down after inactivity
- Slower cold starts on free tier

### How to Deploy on Render

1. **Sign up:** [render.com](https://render.com)
2. **New** → **Web Service**
3. **Connect GitHub** → Select your repo
4. **Configure:**
   - **Name:** `ak-tours-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Add Environment Variables:**
   - `MONGODB_URI`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `NODE_ENV` = `production`
6. **Deploy** - Render provides URL like `https://ak-tours-backend.onrender.com`

---

## Option 4: Heroku

### ✅ Pros
- Well-established platform
- Good documentation
- Add-ons available

### ❌ Cons
- No free tier anymore (paid only)
- More expensive than alternatives

### How to Deploy on Heroku

1. **Install Heroku CLI**
2. **Login:** `heroku login`
3. **Create app:** `heroku create ak-tours-backend`
4. **Set buildpack:** `heroku buildpacks:set heroku/nodejs`
5. **Add environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your-uri
   heroku config:set ADMIN_USERNAME=your-username
   heroku config:set ADMIN_PASSWORD=your-password
   ```
6. **Deploy:** `git push heroku main`

---

## Option 5: DigitalOcean App Platform

### ✅ Pros
- Reliable and scalable
- Good performance
- Multiple pricing tiers

### ❌ Cons
- Paid service (starts at $5/month)
- More complex setup

### How to Deploy on DigitalOcean

1. **Sign up:** [digitalocean.com](https://digitalocean.com)
2. **Create App** → **GitHub** → Select repo
3. **Configure:**
   - **Type:** Web Service
   - **Source Directory:** `backend`
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
4. **Add Environment Variables**
5. **Deploy**

---

## Option 6: Fly.io

### ✅ Pros
- Free tier available
- Global edge deployment
- Good for Node.js
- Fast cold starts

### ❌ Cons
- Requires CLI setup
- More technical

### How to Deploy on Fly.io

1. **Install Fly CLI:** `npm install -g flyctl`
2. **Login:** `flyctl auth login`
3. **Initialize:** `cd backend && flyctl launch`
4. **Configure `fly.toml`:**
   ```toml
   [build]
     builder = "paketobuildpacks/builder:base"
   
   [http_service]
     internal_port = 5000
     force_https = true
   ```
5. **Deploy:** `flyctl deploy`

---

## Option 7: Cyclic.sh

### ✅ Pros
- Free tier
- Serverless Node.js
- Auto-scaling
- Simple deployment

### ❌ Cons
- Newer platform
- Less documentation

### How to Deploy on Cyclic

1. **Sign up:** [cyclic.sh](https://cyclic.sh)
2. **Connect GitHub**
3. **Select repo** → Set root to `backend`
4. **Add environment variables**
5. **Deploy** - Automatic!

---

## Comparison Table

| Platform | Free Tier | Ease of Use | Best For |
|----------|-----------|-------------|----------|
| **Vercel (Separate)** | ✅ Yes | ⭐⭐⭐⭐⭐ | Keeping everything on Vercel |
| **Railway** | ✅ Yes | ⭐⭐⭐⭐ | Quick deployment |
| **Render** | ✅ Yes* | ⭐⭐⭐⭐ | Simple setup |
| **Heroku** | ❌ No | ⭐⭐⭐ | Established apps |
| **DigitalOcean** | ❌ No | ⭐⭐⭐ | Production apps |
| **Fly.io** | ✅ Yes | ⭐⭐⭐ | Global edge |
| **Cyclic** | ✅ Yes | ⭐⭐⭐⭐ | Serverless Node.js |

*Render free tier spins down after inactivity

---

## Recommended Approach

### For Your Use Case:

**Best Option: Deploy Backend Separately on Vercel**

**Why:**
1. ✅ You're already using Vercel for frontend
2. ✅ Familiar platform
3. ✅ No learning curve
4. ✅ Easy CORS configuration
5. ✅ Separate deployments = easier debugging
6. ✅ No serverless function limits

**Steps:**
1. Deploy backend as separate Vercel project
2. Configure CORS to allow frontend domain
3. Update frontend API URL
4. Deploy frontend (already done)

---

## CORS Configuration for All Options

Regardless of which platform you choose, update `backend/server.js`:

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://www.aktoursandtravels.info',
      'https://aktoursandtravels.info',
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000'  // Alternative dev port
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Or for development (allow all):

```javascript
app.use(cors({
  origin: '*', // In production, specify your frontend domain
  credentials: true
}));
```

---

## Next Steps

1. **Choose a platform** (recommended: Vercel separate project)
2. **Deploy backend** following the guide above
3. **Update CORS** configuration
4. **Update frontend** API URL
5. **Test** the connection
6. **Deploy frontend** (if not already done)

---

## Need Help?

- Check platform-specific documentation
- Review CORS configuration
- Test API endpoints with Postman/curl
- Check environment variables
- Review deployment logs


