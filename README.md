
# Full-Stack ERC-20 Token Faucet DApp

A production-ready Decentralized Application (DApp) that distributes ERC-20 tokens with enforced on-chain rate limiting. This project demonstrates full-stack Web3 development capabilities including smart contract design, frontend integration, and Docker containerization.

## 🔗 Deployed Contracts (Sepolia Testnet)

| Contract | Address | Etherscan Link |
|----------|---------|----------------|
| **Token (FCT)** | `0xc5504DF5631A410B2e0fD3407eaF7C84f126fDc3` | [View on Etherscan](https://sepolia.etherscan.io/address/0xc5504DF5631A410B2e0fD3407eaF7C84f126fDc3) |
| **Faucet** | `0xa25370a1758724a62650F41756FDFB82B3ebAEc0` | [View on Etherscan](https://sepolia.etherscan.io/address/0xa25370a1758724a62650F41756FDFB82B3ebAEc0) |

---

## 📸 Screenshots

### 1. Wallet Connection Interface
*The landing interface prompts users to connect their Web3 wallet (MetaMask).
It automatically detects:*
![Interface](screenshots/Screenshot%201.png)

### 2. Token balance display
*After connecting a wallet, the dashboard displays:*
![Dashboard](screenshots/Screenshot%202.png)

### 3. Successful Claim
*This screen shows a successful faucet claim:*
![Success Claim](screenshots/Screenshot%203.png)

### 4. Cooldown Enforcement
*The smart contract enforces a strict 24-hour cooldown period, preventing abuse.*
![Cooldown State](screenshots/Screenshot%204.png)

### 5. Transaction Confirmation
*The smart contract enforces a strict 24-hour cooldown per wallet:*
![Transaction Confirmation](screenshots/Screenshot%204.png)

---

## 🚀 Quick Start (Docker)

The application is fully containerized. You can spin up the entire frontend with a single command.

### 1. Clone the Repository
```bash
git clone https://github.com/ganesh714/fullstack-token-distributor
cd fullstack-token-distributor

```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env

```

Ensure your `.env` contains:

```ini
VITE_RPC_URL=https://sepolia.infura.io/v3/7b04f9e8380b42c48f1f98f27b794808
VITE_TOKEN_ADDRESS=0xc5504DF5631A410B2e0fD3407eaF7C84f126fDc3
VITE_FAUCET_ADDRESS=0xa25370a1758724a62650F41756FDFB82B3ebAEc0
```

### 3. Run the Application

```bash
docker compose up --build

```

### 4. Access

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

* **Health Check:** [http://localhost:3000/health](https://www.google.com/search?q=http://localhost:3000/health)

---

## 🏗 Project Architecture

### 📂 Directory Structure

```
├── contracts/          # Hardhat Project (Smart Contracts)
│   ├── contracts/      # Solidity Source Code
│   ├── scripts/        # Deployment Scripts
│   └── test/           # Unit Tests
├── frontend/           # React + Vite Application
│   ├── src/            # Frontend Source Code
│   └── Dockerfile      # Container Configuration
├── screenshots/        # Project Demonstration Images
└── docker-compose.yml  # Docker Orchestration

```

### 🧠 Smart Contract Logic

* **Token:** Standard ERC-20 with a fixed supply of 1,000,000 tokens. Minter role granted exclusively to Faucet.
* **Faucet:**
* **Rate Limit:** 1 claim per 24 hours per address.
* **Lifetime Limit:** Maximum 1000 tokens per address.
* **Security:** Checks-Effects-Interactions pattern used to prevent reentrancy.
* **Admin Control:** Pausable functionality for emergency stops.



### 💻 Frontend Features

* **Real-time Updates:** Balances and status update automatically after transactions.
* **Error Handling:** User-friendly messages for cooldowns, network errors, and rejection.
* **Eval Interface:** Exposes `window.__EVAL__` for automated grading integration.

---

## 🧪 Testing

### Smart Contract Tests

The backend includes comprehensive tests for cooldowns, limits, and access control.

```bash
cd contracts
npx hardhat test

```

### Automated Evaluation

The frontend exposes a testing interface for the grading bot:

```javascript
// Example usage in Browser Console
await window.__EVAL__.connectWallet();
await window.__EVAL__.requestTokens();

```

---

## 🛡 Security Considerations

* **Reentrancy Guard:** Not strictly needed for Minting but good practice; state updates happen *before* external calls.
* **Access Control:** Only the Faucet contract has the `MINTER_ROLE`.
* **Environment Variables:** Private keys are never hardcoded; loaded via `.env`.

---

## 👤 Author

**Venkata Ganesh**

