# Token Faucet DApp (GFT)

A production-ready Decentralized Application (DApp) that distributes ERC-20 tokens with enforced on-chain rate limiting. This project demonstrates full-stack Web3 development capabilities including smart contract design, frontend integration, and Docker containerization.

## 🔗 Deployed Contracts (Sepolia Testnet)

| Contract        | Address                                      | Etherscan Link                                                                                       |
| --------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Token (GFT)** | `0xc5504DF5631A410B2e0fD3407eaF7C84f126fDc3` | [View on Etherscan](https://sepolia.etherscan.io/address/0xc5504DF5631A410B2e0fD3407eaF7C84f126fDc3) |
| **Faucet**      | `0xa25370a1758724a62650F41756FDFB82B3ebAEc0` | [View on Etherscan](https://sepolia.etherscan.io/address/0xa25370a1758724a62650F41756FDFB82B3ebAEc0) |

---

## 📸 Screenshots

### 1. Wallet Connection Interface

The landing interface prompts users to connect their Web3 wallet (MetaMask). It automatically detects the connection status and network.

### 2. Token Balance Display

After connecting a wallet, the dashboard displays the user's current **GFT** balance and their lifetime claim usage.

### 3. Successful Claim

Users receive immediate feedback upon a successful faucet claim, with the transaction hash and updated balance.

### 4. Cooldown Enforcement

The smart contract enforces a strict **24-hour cooldown** period. The UI displays a countdown timer indicating when the next claim is available.

---

## 🚀 Quick Start (Docker)

The application is fully containerized. You can spin up the entire frontend with a single command.

### 1. Clone the Repository

```bash
git clone [https://github.com/satishpaidikondala/token-faucet-dapp.git](https://github.com/satishpaidikondala/token-faucet-dapp.git)
cd token-faucet-dapp
2. Configure Environment
Create a .env file in the root directory:

Bash

cp .env.example .env
Ensure your .env contains the correct Sepolia addresses:

Ini, TOML

# RPC URL for Sepolia Network
VITE_RPC_URL=[https://sepolia.infura.io/v3/YOUR_INFURA_KEY](https://sepolia.infura.io/v3/YOUR_INFURA_KEY)

# Deployed Contract Addresses
VITE_TOKEN_ADDRESS=0xc5504DF5631A410B2e0fD3407eaF7C84f126fDc3
VITE_FAUCET_ADDRESS=0xa25370a1758724a62650F41756FDFB82B3ebAEc0
3. Run the Application
Bash

docker compose up --build
4. Access
Frontend: Open http://localhost:3000 in your browser.

Health Check: http://localhost:3000/health

🏗 Project Architecture
📂 Directory Structure
Plaintext

├── contracts-backend/  # Hardhat Project (Smart Contracts)
│   ├── contracts/      # Solidity Source Code (Token.sol, TokenFaucet.sol)
│   ├── scripts/        # Deployment Scripts
│   └── hardhat.config.js
├── frontend/           # React + Vite Application
│   ├── src/            # Frontend Source Code
│   ├── server.js       # Express Server for Production
│   └── Dockerfile      # Container Configuration
└── docker-compose.yml  # Docker Orchestration
🧠 Smart Contract Logic
Token (GFT): Standard ERC-20 with a fixed supply of 1,000,000 GFT. The Minter role is granted exclusively to the Faucet contract.

Faucet:

Rate Limit: 1 claim per 24 hours per address.

Claim Amount: 10 GFT per claim.

Lifetime Limit: Maximum 100 GFT per address.

Security: Checks-Effects-Interactions pattern used to prevent reentrancy.

Admin Control: Pausable functionality for emergency stops.

💻 Frontend Features
Real-time Updates: Balances and status update automatically after transactions using polled data fetching.

Error Handling: User-friendly messages for cooldowns, network errors, and rejection.

Eval Interface: Exposes window.__EVAL__ for automated grading integration.

🧪 Testing
Smart Contract Tests
The backend includes comprehensive tests for cooldowns, limits, and access control.

Bash

cd contracts-backend
npx hardhat test
Automated Evaluation
The frontend exposes a testing interface for the grading bot (accessible in Browser Console):

JavaScript

// Connect Wallet
await window.__EVAL__.connectWallet();

// Request Tokens
await window.__EVAL__.requestTokens();

// Check Balance
await window.__EVAL__.getBalance("YOUR_ADDRESS");
🛡 Security Considerations
Reentrancy Guard: State updates (lastClaimAt, totalClaimed) happen before external calls (token.mint).

Access Control: Only the Faucet contract has the MINTER_ROLE on the Token contract.

Environment Variables: Secrets are loaded via .env and passed as build arguments in Docker.

👤 Author
Satish Paidikondala
```
