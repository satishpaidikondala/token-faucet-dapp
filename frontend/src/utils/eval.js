import { ethers } from "ethers";
import TOKEN_ABI from "../abis/Token.json";
import FAUCET_ABI from "../abis/Faucet.json";

window.__EVAL__ = {
  connectWallet: async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  },
  requestTokens: async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const faucet = new ethers.Contract(
      import.meta.env.VITE_FAUCET_ADDRESS,
      FAUCET_ABI,
      signer
    );
    const tx = await faucet.requestTokens();
    const receipt = await tx.wait();
    return receipt.hash;
  },
  getBalance: async (address) => {
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
    const token = new ethers.Contract(
      import.meta.env.VITE_TOKEN_ADDRESS,
      TOKEN_ABI,
      provider
    );
    const balance = await token.balanceOf(address);
    return balance.toString();
  },
  canClaim: async (address) => {
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
    const faucet = new ethers.Contract(
      import.meta.env.VITE_FAUCET_ADDRESS,
      FAUCET_ABI,
      provider
    );
    return await faucet.canClaim(address);
  },
  getRemainingAllowance: async (address) => {
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
    const faucet = new ethers.Contract(
      import.meta.env.VITE_FAUCET_ADDRESS,
      FAUCET_ABI,
      provider
    );
    const allowance = await faucet.remainingAllowance(address);
    return allowance.toString();
  },
  getContractAddresses: async () => {
    return {
      token: import.meta.env.VITE_TOKEN_ADDRESS,
      faucet: import.meta.env.VITE_FAUCET_ADDRESS,
    };
  },
};
