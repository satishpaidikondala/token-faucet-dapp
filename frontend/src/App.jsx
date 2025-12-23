import { useState, useEffect, useCallback } from "react";
import "./App.css";
import {
  connectWallet,
  getConnectedAccount,
  setupWalletListeners,
  removeWalletListeners,
} from "./utils/wallet";
import {
  getTokenContract,
  getFaucetContract,
  formatBalance,
} from "./utils/contracts";
import { setupEvalInterface } from "./utils/eval";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [claimStatus, setClaimStatus] = useState({
    canClaim: false,
    nextClaimTime: 0,
    remainingAllowance: "0",
    totalClaimed: "0",
  });
  // Track data loading state
  const [dataLoading, setDataLoading] = useState(false);

  const [loading, setLoading] = useState(false); // Transaction loading
  const [message, setMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  // 1. Define handlers first using useCallback to stabilize them
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  }, []);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  const checkConnection = useCallback(async () => {
    const connectedAccount = await getConnectedAccount();
    if (connectedAccount) {
      setAccount(connectedAccount);
    }
  }, []);

  // 2. Define data loading logic
  const loadData = useCallback(async () => {
    if (!account) return;

    setDataLoading(true);
    try {
      // Load token balance
      const tokenContract = await getTokenContract();
      // Renamed variable to avoid "shadowing" warning
      const fetchedBalance = await tokenContract.balanceOf(account);
      setBalance(fetchedBalance.toString());

      // Load faucet status
      const faucetContract = await getFaucetContract();
      const paused = await faucetContract.paused();
      setIsPaused(paused);

      if (!paused) {
        const canClaim = await faucetContract.canClaim(account);
        const remaining = await faucetContract.remainingAllowance(account);
        const lastClaim = await faucetContract.lastClaimAt(account);
        const totalClaimed = await faucetContract.totalClaimed(account);

        setClaimStatus({
          canClaim,
          nextClaimTime: Number(lastClaim) + 24 * 3600,
          remainingAllowance: remaining.toString(),
          totalClaimed: totalClaimed.toString(),
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setMessage(`Error loading data: ${error.message || "Check console"}`);
    } finally {
      setDataLoading(false);
    }
  }, [account]); // Depends on account

  // 3. Define interactions
  const handleConnect = async () => {
    try {
      setLoading(true);
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      setMessage("Wallet connected successfully!");
    } catch (error) {
      setMessage(`Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setLoading(true);
      setMessage("Processing transaction...");

      const faucetContract = await getFaucetContract(true);
      const tx = await faucetContract.requestTokens();

      setMessage("Transaction submitted. Waiting for confirmation...");
      await tx.wait();

      setMessage("Tokens claimed successfully!");
      await loadData(); // Refresh data after claim
    } catch (error) {
      setMessage(`Claim failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 4. Effects
  // Initial setup (run once)
  useEffect(() => {
    setupEvalInterface();
    checkConnection();
    setupWalletListeners(handleAccountsChanged, handleChainChanged);

    return () => {
      removeWalletListeners();
    };
  }, [checkConnection, handleAccountsChanged, handleChainChanged]);

  // Polling data (runs when account changes)
  useEffect(() => {
    if (account) {
      loadData();
      // Poll every 30 seconds
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [account, loadData]);

  // Helper for UI
  const formatTimeRemaining = (timestamp) => {
    if (!timestamp) return "Loading...";
    if (claimStatus.canClaim) return "Ready";
    if (claimStatus.remainingAllowance === "0") return "Lifetime Limit Reached";

    const now = Math.floor(Date.now() / 1000);
    if (now >= timestamp) return "Ready";

    const seconds = timestamp - now;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="App">
      <header>
        <h1>Token Faucet DApp</h1>
        <p>Get free test tokens on Sepolia network</p>
      </header>

      <main>
        {!account ? (
          <div className="connect-section">
            <button
              onClick={handleConnect}
              disabled={loading}
              className="connect-btn"
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
            <p>Connect your wallet to start claiming tokens</p>
          </div>
        ) : (
          <div className="dashboard">
            <div className="wallet-info">
              <h3>Connected Wallet</h3>
              <p className="address">{account}</p>
              <p className="balance">Balance: {formatBalance(balance)} GFT</p>
            </div>

            <div className="faucet-info">
              <h3>Faucet Status</h3>

              {isPaused ? (
                <div className="alert warning">
                  ⚠️ Faucet is currently paused
                </div>
              ) : (
                <>
                  <div className="status-item">
                    <span>Can Claim:</span>
                    <span
                      className={claimStatus.canClaim ? "success" : "error"}
                    >
                      {dataLoading
                        ? "..."
                        : claimStatus.canClaim
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>

                  <div className="status-item">
                    <span>Next Claim In:</span>
                    <span>
                      {dataLoading
                        ? "Calculating..."
                        : formatTimeRemaining(claimStatus.nextClaimTime)}
                    </span>
                  </div>

                  <div className="status-item">
                    <span>Remaining Allowance:</span>
                    <span>
                      {formatBalance(claimStatus.remainingAllowance)} GFT
                    </span>
                  </div>

                  <div className="status-item">
                    <span>Total Claimed:</span>
                    <span>{formatBalance(claimStatus.totalClaimed)} GFT</span>
                  </div>

                  <button
                    onClick={handleClaim}
                    disabled={
                      !claimStatus.canClaim ||
                      loading ||
                      isPaused ||
                      dataLoading
                    }
                    className="claim-btn"
                  >
                    {loading ? "Processing..." : "Claim 10 GFT"}
                  </button>

                  <p className="info">
                    Each claim gives 10 GFT tokens. You can claim once every 24
                    hours. Maximum lifetime claim: 100 GFT.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {message && (
          <div
            className={`message ${
              message.includes("Error") || message.includes("failed")
                ? "error"
                : "success"
            }`}
          >
            {message}
          </div>
        )}
      </main>

      <footer>
        <p>Built for GPP Bonus Task 4 - Full-Stack ERC-20 Token Faucet DApp</p>
        <p>Network: Sepolia | Token: GPP Faucet Token (GFT)</p>
      </footer>
    </div>
  );
}

export default App;
