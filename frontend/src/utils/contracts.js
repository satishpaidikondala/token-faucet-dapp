import { ethers } from 'ethers';

// Contract ABIs (simplified for demo - use full ABIs from artifacts)
const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

const FAUCET_ABI = [
  "function requestTokens() external",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)",
  "function lastClaimAt(address) view returns (uint256)",
  "function totalClaimed(address) view returns (uint256)",
  "function paused() view returns (bool)", // <--- CHANGED from isPaused()
  "function getClaimStatus(address) view returns (bool, uint256, uint256)",
  "event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event FaucetPaused(bool paused)"
];

export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
};

export const getSigner = async () => {
  if (!window.ethereum) throw new Error("No wallet detected");
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
};

export const getTokenContract = async (withSigner = false) => {
  const address = import.meta.env.VITE_TOKEN_ADDRESS;
  if (!address) throw new Error("Token address not configured");
  
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(address, TOKEN_ABI, signer);
  }
  
  const provider = getProvider();
  return new ethers.Contract(address, TOKEN_ABI, provider);
};

export const getFaucetContract = async (withSigner = false) => {
  const address = import.meta.env.VITE_FAUCET_ADDRESS;
  if (!address) throw new Error("Faucet address not configured");
  
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(address, FAUCET_ABI, signer);
  }
  
  const provider = getProvider();
  return new ethers.Contract(address, FAUCET_ABI, provider);
};

export const formatBalance = (balance, decimals = 18) => {
  return ethers.formatUnits(balance || '0', decimals);
};

export const parseBalance = (balance, decimals = 18) => {
  return ethers.parseUnits(balance.toString(), decimals);
};