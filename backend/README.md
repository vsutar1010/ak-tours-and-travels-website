# AK Tours & Travels - Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas Account
- Git

## Installation Steps

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and log in
3. Create a new cluster (free tier)
4. Click on "Connect" button
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<username>`, `<password>`, and database name in the string

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/aktours?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
ADMIN_USERNAME=aktourstravels3693@gmail.com
ADMIN_PASSWORD=aktour@3693
JWT_SECRET=your_jwt_secret_key_here
```

**Important:** Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### 4. Start the Backend Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Feedback Routes

#### Submit Feedback
- **POST** `/api/feedback/submit`
- **Body:**
```json
{
  "name": "John Doe",
  "rating": 5,
  "message": "Great service!",
  "tags": ["verified", "top-review"],
  "media": "base64_string_or_null",
  "mediaType": "image" or "video" or null
}
```

#### Get Approved Feedbacks
- **GET** `/api/feedback/approved`
- **Returns:** All approved feedbacks for public display

#### Get Pending Feedbacks (Admin)
- **GET** `/api/feedback/pending`
- **Returns:** All feedbacks waiting for approval

#### Approve Feedback (Admin)
- **PUT** `/api/feedback/approve/:id`
- **Body:**
```json
{
  "feedbackId": "feedback_id_here"
}
```

#### Reject Feedback (Admin)
- **DELETE** `/api/feedback/reject/:id`
- **Body:**
```json
{
  "feedbackId": "feedback_id_here"
}
```

### Admin Routes

#### Admin Login
- **POST** `/api/admin/login`
- **Body:**
```json
{
  "username": "aktourstravels3693@gmail.com",
  "password": "aktour@3693"
}
```

## Frontend API Base URL

Update your frontend `.env` or API configuration:

```
VITE_API_URL=http://localhost:5000/api
```

Or update it directly in your frontend files:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── Feedback.js        # Feedback schema
├── routes/
│   ├── feedback.js        # Feedback API routes
│   └── admin.js           # Admin API routes
├── server.js              # Main server file
├── package.json           # Dependencies
└── .env                   # Environment variables
```

## Troubleshooting

### MongoDB Connection Error
- Verify credentials in `.env`
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure cluster is running

### Port Already in Use
- Change PORT in `.env` to another number (e.g., 5001)

### CORS Issues
- Ensure frontend URL is allowed in CORS configuration

## Next Steps

1. Update your frontend to use these API endpoints
2. Test feedback submission from Profile.jsx
3. Test feedback display from Feedback.jsx
4. Test admin approval from AdminLogin.jsx
