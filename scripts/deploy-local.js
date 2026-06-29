const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const token = await hre.ethers.deployContract("FaucetToken");
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TOKEN_ADDRESS=" + tokenAddress);

  const faucet = await hre.ethers.deployContract("TokenFaucet", [tokenAddress]);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("FAUCET_ADDRESS=" + faucetAddress);

  const MINTER_ROLE = await token.MINTER_ROLE();
  await token.grantRole(MINTER_ROLE, faucetAddress);
  console.log("Minter role granted");

  console.log("\nUpdate .env with:");
  console.log("VITE_TOKEN_ADDRESS=" + tokenAddress);
  console.log("VITE_FAUCET_ADDRESS=" + faucetAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
