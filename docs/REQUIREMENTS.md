# Software Requirements Specification (SRS)
## Blockchain-Based Audit Log System

---

## 1. Introduction

### 1.1 Purpose
The purpose of this project is to develop a blockchain-inspired audit logging system that ensures data integrity, tamper detection, and secure event tracking.

### 1.2 Scope
The system will:
- Store audit logs as blockchain-style linked blocks
- Detect tampering using cryptographic hashing
- Provide APIs for adding logs and verifying integrity
- Ensure immutability of stored audit records

---

## 2. Overall Description

### 2.1 Product Perspective
This system is a backend-based blockchain simulation built using Node.js and MongoDB.

It does not use a public blockchain but implements blockchain concepts such as:
- Hash linking
- Genesis block
- Chain verification

### 2.2 User Classes
- Administrator (can add logs)
- System (verifies blockchain integrity)

---

## 3. Functional Requirements

### FR1: Add Log as Block
The system shall:
- Accept action and user input
- Generate SHA-256 hash
- Link the block using previousHash
- Store block in database

### FR2: Genesis Block Handling
If no previous block exists:
- The system shall assign previousHash = "0"
- Set index = 1

### FR3: Blockchain Verification
The system shall:
- Recalculate hashes for all blocks
- Validate previousHash linkage
- Detect tampering

### FR4: Get All Blocks
The system shall:
- Return full blockchain data sorted by index

### FR5: Input Validation
The system shall:
- Reject empty action or user fields
- Return HTTP 400 for invalid requests

---

## 4. Non-Functional Requirements

### 4.1 Security
- SHA-256 cryptographic hashing
- Tamper detection mechanism
- No block deletion allowed

### 4.2 Performance
- Blockchain verification should complete within reasonable response time
- Efficient database queries

### 4.3 Reliability
- System must maintain data consistency
- Proper error handling implemented

### 4.4 Maintainability
- Modular folder structure
- Clear separation of controllers, models, and routes

---

## 5. Technical Requirements

- Node.js v18+
- MongoDB v7+
- Express.js
- Mongoose
- Crypto (SHA-256)

---

## 6. Assumptions

- System runs on trusted backend server
- MongoDB database is secure
- Only authorized users add logs

---

## 7. Limitations

- Not a distributed blockchain
- No consensus algorithm
- No proof-of-work implemented
- Local blockchain simulation only

---

## 8. Future Enhancements

- AI-based anomaly detection
- Proof-of-work mining
- Smart contract integration
- Multi-node simulation
- Authentication & role-based access