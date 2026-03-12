# Component Documentation

## Overview
This document provides comprehensive details about all components in the Blockchain Audit Log System and their features.

---

## Pages Overview

### 1. **Login Page** (`/login`)
**Purpose**: User authentication and session management

**Features**:
- Secure username/password authentication
- Error handling and validation
- Demo credentials display
- Role-based access control
- Scroll animations on load

**Components Used**:
- `AuthContext` for session management
- `authAPI.login()` for authentication

**Key Functionality**:
```javascript
- Validates empty fields
- Communicates with backend auth API
- Stores token and user data in context
- Redirects to dashboard on success
```

**Tech Stack**:
- React Hooks (useState, useContext, useRef, useEffect)
- Intersection Observer API for animations

---

### 2. **Dashboard Page** (`/`)
**Purpose**: Real-time blockchain overview and status monitoring

**Features**:
- Live blockchain statistics (total blocks, suspicious activities, high-risk alerts)
- Blockchain visualization with chain representation
- Selected block detail view
- Recent blocks table (last 10)
- Auto-refresh every 10 seconds
- PDF report download
- Scroll animations for all sections

**Key Metrics**:
| Metric | Description |
|--------|-------------|
| Total Blocks | Complete count of all blockchain blocks |
| Suspicious Activities | Blocks with <5 second timing |
| High Risk Alerts | Blocks with <3 second timing by same user |
| Latest Block | Most recent block index |

**Risk Detection Algorithm**:
- Compares timestamp differences between consecutive blocks from same user
- ≤ 3 seconds = HIGH RISK 🔴
- ≤ 5 seconds = SUSPICIOUS 🟡
- &gt; 5 seconds = NORMAL ✅

**Dependencies**:
- `jsPDF` and `jspdf-autotable` for PDF generation
- `blockchainAPI.getAllBlocks()` for data fetching

---

### 3. **Analytics Page** (`/analytics`)
**Purpose**: Statistical analysis of blockchain activities

**Features**:
- Total blocks count
- Unique users and actions count
- Average blocks per day
- Most active user identification
- Most common action analysis
- Top 5 users by activity
- Top 5 actions by frequency
- Refresh capability
- Scroll animations

**Analytics Calculations**:
```javascript
- Unique Users: Count of distinct user values
- Unique Actions: Count of distinct action types
- Most Active User: User with highest block count
- Most Common Action: Action type appearing most
- Avg Blocks/Day: Total blocks / distinct days
- Top 5: Sorted by frequency, top 5 results
```

**API Calls**:
- `blockchainAPI.getAllBlocks(1, 1000)` - Fetch all blocks

---

### 4. **Add Block Page** (`/add-block`)
**Purpose**: Create new audit log entries (Admin only)

**Features**:
- Admin-only access control
- Action input field
- User input field
- Real-time timestamp display
- Success/error messaging
- Loading state feedback
- Scroll animations

**Access Control**:
```javascript
if (user?.role !== "admin") {
  // Show access denied message
}
```

**Block Creation**:
1. Validates both fields are not empty
2. Checks user is admin
3. Calls `blockchainAPI.addLog(action, blockUser)`
4. Shows success message for 3 seconds
5. Auto-clears form on success

**Validation**:
- Action: max 200 characters
- User: max 100 characters
- Both fields required

---

### 5. **Verify Page** (`/verify`)
**Purpose**: Blockchain integrity verification and tamper detection

**Features**:
- Full blockchain verification
- Hash validation
- Previous hash linkage checking
- Tamper detection
- Chain break identification
- Detailed verification report
- Blockchain structure explanation
- Scroll animations

**Verification Process**:
```
1. Verify Genesis Block (previousHash = "0")
2. For each block:
   - Recalculate hash
   - Compare with stored hash
   - Check previousHash matches previous block
3. Report any discrepancies
```

**Output**:
- Status: "✅ Valid" or "❌ Tampered"
- Total blocks checked
- Tampering detection (which block)
- Chain break location

**Technical Details**:
- Uses SHA-256 hashing
- Cryptographic verification
- Full-chain validation

---

### 6. **Block Details Page** (`/block/:id`)
**Purpose**: Detailed view of a single block

**Features**:
- Complete block information display
- Hash and previous hash with copy functionality
- Timestamp analysis
- JSON export view
- Back navigation
- Genesis block indicator
- Time-since-creation calculation
- Scroll animations

**Displayed Information**:
```
- Index: Position in blockchain
- Log ID: Unique identifier
- User: User who performed action
- Action: Type of action
- IP Address: Source IP
- Timestamp: When action occurred
- Hash: Current block's SHA-256 hash
- Previous Hash: Previous block's hash
```

**Copy to Clipboard**:
```javascript
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!");
};
```

---

### 7. **Risk Monitor Page** (`/risk-monitor`)
**Purpose**: Real-time detection and monitoring of suspicious activities

**Features**:
- Real-time risk assessment
- High-risk block detection
- Suspicious activity identification
- Detailed risk analysis
- Selected risk detail view
- Risk level indicators
- Auto-refresh every 10 seconds
- Scroll animations

**Risk Levels**:
| Risk Level | Criteria | Indicator |
|-----------|----------|-----------|
| HIGH | <3 sec between same user actions | 🔴 |
| MEDIUM | 3-5 sec between same user actions | 🟡 |
| SAFE | >5 sec or different users | ✅ |

**Critical Status**:
- 🚨 CRITICAL: >5 high-risk blocks
- ⚠️ HIGH RISK: 1-5 high-risk blocks
- 🟡 SUSPICIOUS: Only medium-risk blocks
- ✅ SAFE: No risks detected

**Features**:
- Sortable tables
- Click to view risk details
- Comparative block analysis
- Detailed risk explanation

---

### 8. **User Management Page** (`/user-management`)
**Purpose**: Admin user and role management

**Features**:
- Create new users with roles
- List all users
- Delete users
- Role assignments
- Password requirements display
- Role descriptions
- Refresh user list
- Scroll animations

**Roles**:
| Role | Permissions |
|------|------------|
| **Viewer** 👁️ | View dashboard, View blocks |
| **Auditor** 📋 | View blocks, Verify blockchain, Generate reports |
| **Admin** ⚙️ | Add blocks, Manage users, Full access |

**Password Requirements**:
- Minimum 6 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)

**User Creation**:
```javascript
- Validate both username and password
- Check password meets requirements
- Call authAPI.createUser()
- Reload user list on success
- Show 2-second success message
```

---

## Shared Components

### **Navbar Component** (`src/components/Navbar.js`)
**Features**:
- Navigation menu
- User authentication status
- Logout functionality
- Role-based menu items
- Responsive design

---

## Context & State Management

### **AuthContext** (`src/context/AuthContext.js`)
**Purpose**: Global authentication state management

**Features**:
- User session storage
- JWT token management
- Login/logout functionality
- Role-based access control
- User data persistence

**State**:
```javascript
{
  user: {
    id: string,
    username: string,
    role: "viewer" | "auditor" | "admin"
  },
  token: string,
  isAuthenticated: boolean
}
```

---

## API Client

### **apiClient.js** (`src/api/apiClient.js`)
**Purpose**: Centralized API communication

**Methods**:
```javascript
// Auth
authAPI.login(username, password)
authAPI.getUsers()
authAPI.createUser(username, password, role)
authAPI.deleteUser(id)

// Blockchain
blockchainAPI.getAllBlocks(page, limit)
blockchainAPI.getBlockById(id)
blockchainAPI.addLog(action, user)
blockchainAPI.verifyBlockchain()
```

---

## UI/UX Features

### **Scroll Animations** ✨
- All pages include smooth scroll-triggered animations
- Elements slide in from bottom, left, and right
- Intersection Observer API for performance
- See [SCROLL_ANIMATIONS.md](/SCROLL_ANIMATIONS.md) for detailed docs

### **Error Handling**
```javascript
// Consistent error display
{error && <div className="error-message">{error}</div>}
```

### **Loading States**
```javascript
{loading ? (
  <p>🔄 Loading...</p>
) : (
  // Content
)}
```

### **Success Messaging**
```javascript
{message && <div className="success-message">{message}</div>}
```

---

## Animation Effects

### **Fade In**
- Page load animation
- Duration: 0.6s
- Easing: ease-in-out

### **Scroll Animations**
- Element entrance: 0.8s
- Easing: ease-out
- Direction: Bottom, Left, Right

### **Hover Effects**
- Card elevation on hover
- Border color changes
- Shadow enhancement
- Smooth transitions (0.3s)

---

## Performance Optimizations

1. **Code Splitting**: Each page is a separate component
2. **Lazy Loading**: Images and components load on demand
3. **Intersection Observer**: Efficient scroll detection
4. **Memoization**: React.memo for list items
5. **Event Debouncing**: API calls are debounced
6. **CSS Optimization**: Hardware-accelerated animations

---

## Responsive Design

- **Mobile**: Single column layout
- **Tablet**: 2 column grid
- **Desktop**: 3-4 column grid
- **Max Width**: 1200px centered

---

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Role-Based Access Control**: Page-level access control
3. **Password Requirements**: Strong password enforcement
4. **Protected Routes**: Components check authentication
5. **Data Validation**: Input validation on client & server
6. **XSS Prevention**: React's built-in XSS protection

---

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ⚠️ Limited (no IntersectionObserver)

---

## File Structure

```
frontend/src/
├── pages/
│   ├── Login.js
│   ├── Dashboard.js
│   ├── Analytics.js
│   ├── AddBlock.js
│   ├── Verify.js
│   ├── BlockDetails.js
│   ├── RiskMonitor.js
│   └── UserManagement.js
├── components/
│   ├── Navbar.js
│   └── ProtectedRoute.js
├── context/
│   └── AuthContext.js
├── api/
│   └── apiClient.js
└── styles/
    └── App.css
```

---

**Last Updated**: March 2026
**Version**: 1.0
**Status**: Complete & Documented
