# 🪙 Full-Stack ERC-20 Token Faucet DApp

A production-ready Decentralized Application (DApp) that distributes ERC-20 tokens with enforced on-chain rate limiting. This project demonstrates full-stack Web3 development capabilities including smart contract design, frontend integration, and Docker containerization.

---

## ✨ Features

- **ERC-20 Token (FCT)** — Custom token with role-based minting and 1M max supply
- **On-Chain Rate Limiting** — 100 FCT per claim, 24-hour cooldown, 1,000 FCT lifetime cap
- **Security** — ReentrancyGuard, Pausable, Ownable, AccessControl (OpenZeppelin)
- **React Frontend** — Wallet connection, real-time status, claim interface
- **Dockerized** — One-command deployment with multi-stage builds

---

## 🏗️ Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Smart Contracts  | Solidity 0.8.20, OpenZeppelin       |
| Development      | Hardhat, Ethers.js                  |
| Frontend         | React (Vite), Ethers.js v6          |
| Testing          | Chai, Hardhat Network Helpers       |
| Containerization | Docker, Docker Compose              |
| Network          | Sepolia Testnet / Hardhat Local     |

---

## 🔗 Deployed Contracts (Sepolia Testnet)

> After deploying, update the addresses in your `.env` file.

| Contract        | Address                                    |
| --------------- | ------------------------------------------ |
| **Token (FCT)** | `<YOUR_DEPLOYED_TOKEN_ADDRESS>`            |
| **Faucet**      | `<YOUR_DEPLOYED_FAUCET_ADDRESS>`           |

---

## 📸 Screenshots

### 1. Wallet Connection Interface
The landing interface prompts users to connect their Web3 wallet (MetaMask). It automatically detects the connection status and enforces the Sepolia network.

### 2. Token Balance Display
After connecting a wallet, the dashboard displays the user's current **FCT** balance and their lifetime claim usage.

### 3. Successful Claim
Users receive immediate feedback upon a successful faucet claim, with the transaction hash and updated balance.

### 4. Cooldown Enforcement
The smart contract enforces a strict **24-hour cooldown** period. The UI displays a countdown timer indicating when the next claim is available.

---

## 🚀 Quick Start (Docker)

The application is fully containerized. Spin up the frontend with a single command.

### 1. Clone the Repository

```bash
git clone https://github.com/satishpaidikondala/token-faucet-dapp.git
cd token-faucet-dapp
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your deployed contract addresses and RPC URL
```

### 3. Run with Docker

```bash
docker-compose up --build
```

The frontend will be available at **http://localhost:3000**.

---

## 🧪 Testing

Run the full test suite:

```bash
npx hardhat test
```

Tests cover:
- Token deployment and metadata
- Faucet claim flow
- 24-hour cooldown enforcement (time manipulation via Hardhat helpers)
- 1,000 FCT lifetime limit
- Pause/unpause functionality
- View function correctness

---

## 📁 Project Structure

```
token-faucet-dapp/
├── contracts/
│   ├── Token.sol          # ERC-20 token with MINTER_ROLE
│   └── TokenFaucet.sol    # Faucet with rate limiting
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   └── utils/         # Wallet, contract, eval helpers
│   ├── Dockerfile         # Multi-stage build
│   └── server.js          # Express production server
├── scripts/
│   └── deploy.js          # Deployment + verification script
├── test/
│   └── TokenFaucet.test.js
├── docker-compose.yml
└── hardhat.config.js
```

---

## 📄 License

MIT
