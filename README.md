**🔐 SecureChain**
Blockchain-Based Audit Monitoring System

SecureChain is a full-stack blockchain-inspired audit logging system designed to ensure tamper-proof activity tracking, secure log storage, and real-time chain verification.

This system simulates a blockchain structure where every log entry is stored as a block linked using SHA-256 hashing to guarantee integrity and detect unauthorized modifications.

**🚀 Features**

🔗 Blockchain-style hash chaining
🔒 Tamper detection & chain validation
📊 Real-time analytics dashboard
🚨 Suspicious & high-risk activity detection
🔐 Role-Based Access Control (Admin, Auditor, User)
📥 Professional PDF audit report generation
🎨 Multi-page React UI

**🏗 How It Works**

Each audit log is stored as a block containing:

Index
Log ID
User
Action
IP Address
Timestamp
Previous Hash
SHA-256 Hash

**Each block’s hash is generated using:**

index + logId + action + user + ip + timestamp + previousHash

If any block is modified, the hash changes → chain validation fails → tampering is detected immediately.

**⚙️ Tech Stack**
**Backend**

Node.js
Express.js
MongoDB
Mongoose
Crypto (SHA-256)

**Frontend**

React.js
React Router
Context API (Authentication)
jsPDF (PDF report generation)

**📡 API Endpoints**

Add Log (Admin Only)
POST /add-log

Verify Blockchain
GET /verify/test

Get Full Blockchain
GET /blocks

**📥 PDF Report**

The system generates a professional audit report including:

Total blocks
Risk summary
Blockchain integrity status
Complete block table
Generation timestamp

**🛠 Installation**
**Backend**
npm install
node server.js

Runs on: http://localhost:5000

**Frontend**
cd frontend-react
npm install
npm start

Runs on: http://localhost:3000

**👨‍💻 Author**

Yudhveer Sharma