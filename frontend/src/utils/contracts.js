import { ethers } from "ethers";
import TOKEN_ABI from "../abis/Token.json";
import FAUCET_ABI from "../abis/Faucet.json";

export const getTokenContract = async (withSigner = false) => {
  if (!window.ethereum) throw new Error("No crypto wallet found");

  const provider = new ethers.BrowserProvider(window.ethereum);

  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(
      import.meta.env.VITE_TOKEN_ADDRESS,
      TOKEN_ABI,
      signer
    );
  }

  return new ethers.Contract(
    import.meta.env.VITE_TOKEN_ADDRESS,
    TOKEN_ABI,
    provider
  );
};

export const getFaucetContract = async (withSigner = false) => {
  if (!window.ethereum) throw new Error("No crypto wallet found");

  const provider = new ethers.BrowserProvider(window.ethereum);

  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(
      import.meta.env.VITE_FAUCET_ADDRESS,
      FAUCET_ABI,
      signer
    );
  }

  return new ethers.Contract(
    import.meta.env.VITE_FAUCET_ADDRESS,
    FAUCET_ABI,
    provider
  );
};

export const formatBalance = (rawBalance) => {
  if (!rawBalance) return "0";
  // Formats BigInt string (wei) to human readable string (ether)
  // Assuming 18 decimals as defined in Token.sol
  try {
    const formatted = ethers.formatUnits(rawBalance, 18);
    // Optional: limit decimals for cleaner UI
    return parseFloat(formatted).toFixed(2);
  } catch (e) {
    console.error("Error formatting balance:", e);
    return "0";
  }
};
