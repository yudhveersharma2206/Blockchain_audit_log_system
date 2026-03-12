# 🔐 SecureChain - Blockchain Audit Log System
## Complete Setup & Deployment Guide

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Installation & Setup](#installation--setup)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [API Documentation](#api-documentation)
7. [Features](#features)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

SecureChain is a full-stack blockchain-inspired audit logging system that ensures:
- ✅ **Tamper-proof** activity tracking using SHA-256 hashing
- ✅ **Chain validation** to detect unauthorized modifications
- ✅ **Real-time analytics** and risk monitoring
- ✅ **Role-based access control** (Admin, Auditor, Viewer)
- ✅ **Professional audit reports** (PDF export)

### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- **Frontend**: React.js, React Router, Context API, jsPDF
- **Security**: SHA-256 hashing, bcrypt password hashing, JWT authentication

---

## 💻 System Requirements

### Minimum Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v7.0.0 or higher (Local or Cloud - MongoDB Atlas recommended)
- **RAM**: 2GB minimum
- **Storage**: 500MB minimum

### Recommended
- **Node.js**: v20+ LTS
- **MongoDB**: Cloud (MongoDB Atlas) for better reliability
- **RAM**: 4GB+

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
cd "Blockchain-Audit-Log-System-Upgraded"
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Create Environment File
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
# Important: Change JWT_SECRET to a strong random string
```

#### 2.4 Backend Startup Checklist
- ✅ MongoDB is running and accessible
- ✅ `.env` file is configured correctly
- ✅ Port 5000 is available (or change PORT in .env)

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend
```bash
cd ../frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Create Environment File
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local if your backend is on a different URL
# Default: REACT_APP_API_URL=http://localhost:5000
```

---

## ⚙️ Configuration

### Backend Configuration (.env)

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/blockchain-audit
# OR use MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blockchain-audit

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_strong_random_secret_key_here_change_this
JWT_EXPIRY=2h

# Server
PORT=5000
NODE_ENV=development

# CORS (Frontend URL)
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Configuration (.env.local)

```env
REACT_APP_API_URL=http://localhost:5000
```

### MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service:

# On macOS (with Homebrew)
brew services start mongodb-community

# On Windows (with installer)
net start MongoDB

# On Linux (with package manager)
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Update `MONGO_URI` in `.env`

---

## ▶️ Running the Application

### Method 1: Local Development (Recommended)

#### Terminal 1: Backend
```bash
cd backend
npm install  # (if not already done)
npm run dev
# or: npm start
# Output: 🚀 Server running on port 5000
```

#### Terminal 2: Frontend
```bash
cd frontend
npm install  # (if not already done)
npm start
# Auto-opens: http://localhost:3000
```

### Method 2: Production Build

#### Backend
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run build
# Deploy 'build' folder to hosting service
```

---

## 🔗 API Documentation

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123",
  "role": "viewer"
}

Response: { success: true, message: "User registered successfully" }
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}

Response: {
  success: true,
  message: "Login successful",
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    id: "...",
    username: "john_doe",
    role: "viewer"
  }
}
```

#### Get All Users (Admin Only)
```
GET /auth/users
Authorization: Bearer <token>

Response: {
  success: true,
  count: 5,
  users: [...]
}
```

#### Create User (Admin Only)
```
POST /auth/create-user
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_user",
  "password": "StrongPass123",
  "role": "auditor"
}
```

#### Delete User (Admin Only)
```
DELETE /auth/user/:userId
Authorization: Bearer <token>
```

### Blockchain Endpoints

#### Add Block (Admin Only)
```
POST /add-log
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "USER_LOGIN",
  "user": "john_doe"
}

Response: {
  success: true,
  message: "Block added successfully",
  block: {...}
}
```

#### Get All Blocks
```
GET /blocks?page=1&limit=50
Authorization: Bearer <token>

Response: {
  success: true,
  pagination: {
    total: 100,
    page: 1,
    limit: 50,
    pages: 2
  },
  blockchain: [...]
}
```

#### Filter Blocks
```
GET /blocks/filter?user=john&action=LOGIN&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### Get Single Block
```
GET /block/:blockId
Authorization: Bearer <token>

Response: {
  success: true,
  block: {...}
}
```

#### Verify Blockchain
```
GET /verify
Authorization: Bearer <token>

Response: {
  success: true,
  status: "✅ Blockchain is valid",
  totalBlocks: 42,
  tampered: false
}
```

---

## ✨ Features Implemented

### ✅ Security Features
- JWT-based authentication with Bearer tokens
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Rate limiting on auth endpoints
- CORS protection
- Input validation on all endpoints

### ✅ Blockchain Features
- SHA-256 hash chaining
- Genesis block handling (previousHash = "0")
- Tamper detection
- Full chain verification
- Block immutability concept

### ✅ User Features
- Beautiful responsive UI with emojis
- Real-time dashboard with auto-refresh
- Block visualization
- Risk monitoring
- Analytics dashboard
- PDF report generation
- User management (Admin only)
- Block filtering and search

### ✅ Database Features
- Indexed queries for performance
- Compound indexes for complex filters
- Data validation with Mongoose schemas
- Automatic timestamps

---

## 🔑 Demo Credentials

For quick testing, create these users (or they may be pre-seeded):

```
Admin User:
  Username: admin
  Password: Admin@123
  Role: admin

Auditor User:
  Username: auditor
  Password: Auditor@123
  Role: auditor

Viewer User:
  Username: viewer
  Password: Viewer@123
  Role: viewer
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
**Problem**: `MongoServerSelectionError: connect ECONNREFUSED`

**Solution**:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# If not running, start it:
# macOS:
brew services start mongodb-community

# Windows:
net start MongoDB

# Linux:
sudo systemctl start mongod
```

#### 2. Port Already in Use
**Problem**: `Error: listen EADDRINUSE :::5000`

**Solution**:
```bash
# Change PORT in .env to 5001, 5002, etc.
# OR kill the process using port 5000

# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### 3. CORS Error in Browser
**Problem**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
- Check `CORS_ORIGIN` in backend `.env` matches your frontend URL
- Add port if needed: `http://localhost:3000`

#### 4. Token Expired
**Problem**: `403 Forbidden - Token expired`

**Solution**:
- Log out and log back in
- Check JWT_EXPIRY in `.env`
- Browser dev tools: Check localStorage for token

#### 5. Frontend Won't Load Blocks
**Problem**: Dashboard shows "No blocks found"

**Solution**:
- Verify API URL in `.env.local`
- Check browser console for errors (F12)
- Verify backend is running: `curl http://localhost:5000/health`
- Check if MongoDB has data

---

## 📊 Performance Tips

1. **Database Indexing**: Already configured for optimal queries
2. **Pagination**: API returns paginated results (default: 50 per page)
3. **Lazy Loading**: Frontend doesn't load all blocks at once
4. **Caching**: Implement Redis for frequently accessed data (optional)
5. **Compression**: Enable gzip compression in production

---

## 🔒 Security Best Practices

### Production Checklist
- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas (Cloud) instead of local
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to production domain
- [ ] Use strong passwords for all users
- [ ] Implement rate limiting for all endpoints
- [ ] Add request logging
- [ ] Enable database backups
- [ ] Use environment variables for all secrets

### Example Strong JWT_SECRET Generation
```bash
# macOS/Linux:
openssl rand -base64 32

# Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📈 Monitoring & Maintenance

### Monitor Server Health
```bash
# Check backend health
curl http://localhost:5000/health

# Monitor MongoDB
mongosh

# Check process memory/CPU
top

# View logs
npm run dev 2>&1 | tee app.log
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [JWT Introduction](https://jwt.io/introduction)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

---

## 💡 Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Advanced analytics with charts
- [ ] Machine learning for anomaly detection
- [ ] Multi-blockchain support
- [ ] API key authentication
- [ ] Audit trail for admin actions
- [ ] Data encryption at rest
- [ ] Backup and restore functionality
- [ ] Mobile app (React Native)
- [ ] Docker containerization

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💼 Author

**Yudhveer Sharma**
- 🚀 Blockchain & Audit Systems
- 📧 Contact through GitHub

---

## 🆘 Support

For issues, suggestions, or contributions:
1. Check this guide first
2. Review existing issues/documentation
3. Create a detailed bug report with:
   - Error message
   - Steps to reproduce
   - System information
   - Screenshots

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
