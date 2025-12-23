export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another Web3 wallet");
  }
  
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    return accounts[0];
  } catch (error) {
    if (error.code === 4001) {
      throw new Error("Please connect to MetaMask");
    } else {
      throw error;
    }
  }
};

export const disconnectWallet = () => {
  // Note: MetaMask doesn't have a disconnect method
  // We just clear local state
  window.location.reload();
};

export const getConnectedAccount = async () => {
  if (!window.ethereum) return null;
  
  const accounts = await window.ethereum.request({
    method: 'eth_accounts'
  });
  
  return accounts[0] || null;
};

export const setupWalletListeners = (onAccountsChanged, onChainChanged) => {
  if (!window.ethereum) return;
  
  window.ethereum.on('accountsChanged', onAccountsChanged);
  window.ethereum.on('chainChanged', onChainChanged);
};

export const removeWalletListeners = () => {
  if (!window.ethereum) return;
  
  window.ethereum.removeAllListeners('accountsChanged');
  window.ethereum.removeAllListeners('chainChanged');
};