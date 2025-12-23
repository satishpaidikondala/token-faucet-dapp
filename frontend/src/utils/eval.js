import { connectWallet } from './wallet';
import { getFaucetContract, getTokenContract } from './contracts';

export const setupEvalInterface = () => {
  window.__EVAL__ = {
    connectWallet: async () => {
      try {
        const address = await connectWallet();
        return address;
      } catch (error) {
        throw new Error(`Wallet connection failed: ${error.message}`);
      }
    },
    
    requestTokens: async () => {
      try {
        const contract = await getFaucetContract(true);
        const tx = await contract.requestTokens();
        await tx.wait();
        return tx.hash;
      } catch (error) {
        throw new Error(`Token request failed: ${error.message}`);
      }
    },
    
    getBalance: async (address) => {
      try {
        const contract = await getTokenContract();
        const balance = await contract.balanceOf(address);
        return balance.toString();
      } catch (error) {
        throw new Error(`Balance query failed: ${error.message}`);
      }
    },
    
    canClaim: async (address) => {
      try {
        const contract = await getFaucetContract();
        return await contract.canClaim(address);
      } catch (error) {
        throw new Error(`Claim eligibility check failed: ${error.message}`);
      }
    },
    
    getRemainingAllowance: async (address) => {
      try {
        const contract = await getFaucetContract();
        const allowance = await contract.remainingAllowance(address);
        return allowance.toString();
      } catch (error) {
        throw new Error(`Allowance query failed: ${error.message}`);
      }
    },
    
    getContractAddresses: async () => {
      return {
        token: import.meta.env.VITE_TOKEN_ADDRESS,
        faucet: import.meta.env.VITE_FAUCET_ADDRESS
      };
    }
  };
};