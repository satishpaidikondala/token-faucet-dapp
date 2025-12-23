// Global variables to store the listeners so they can be removed later
let accountHandler = null;
let chainHandler = null;

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error) {
      if (error.code === 4001) {
        throw new Error("User rejected the request.");
      }
      throw error;
    }
  } else {
    throw new Error("MetaMask is not installed.");
  }
};

export const getConnectedAccount = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        return accounts[0];
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  }
  return null;
};

export const setupWalletListeners = (
  handleAccountsChanged,
  handleChainChanged
) => {
  if (window.ethereum) {
    // Store references to the handlers
    accountHandler = handleAccountsChanged;
    chainHandler = handleChainChanged;

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
  }
};

export const removeWalletListeners = () => {
  if (window.ethereum) {
    if (accountHandler) {
      window.ethereum.removeListener("accountsChanged", accountHandler);
      accountHandler = null;
    }
    if (chainHandler) {
      window.ethereum.removeListener("chainChanged", chainHandler);
      chainHandler = null;
    }
  }
};
