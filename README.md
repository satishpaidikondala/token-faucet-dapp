# Full-Stack ERC-20 Token Faucet DApp

A production-ready Decentralized Application (DApp) that distributes ERC-20 tokens with enforced on-chain rate limiting. This project demonstrates full-stack Web3 development capabilities including smart contract design, frontend integration, and Docker containerization.

## 🔗 Deployed Contracts (Sepolia Testnet)

| Contract        | Address                                      | Etherscan Link                                                                                       |
| --------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Token (FCT)** | `0xd47cecEe2596d1C3E6B1F1d00CBaE6DEA6B5011F` | [View on Etherscan](https://sepolia.etherscan.io/address/0xd47cecEe2596d1C3E6B1F1d00CBaE6DEA6B5011F) |
| **Faucet**      | `0x84b22782916D67273ff469f94e69843f17D40094` | [View on Etherscan](https://sepolia.etherscan.io/address/0x84b22782916D67273ff469f94e69843f17D40094) |

> **Note:** Ensure these addresses match the ones in your `.env` file.

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

The application is fully containerized. You can spin up the entire frontend with a single command.

### 1. Clone the Repository

```bash
git clone [https://github.com/satishpaidikondala/token-faucet-dapp.git](https://github.com/satishpaidikondala/token-faucet-dapp.git)
cd token-faucet-dapp
```
