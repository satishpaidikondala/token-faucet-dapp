const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy YourToken
  // GPP Requirement: Token must have fixed max supply and only faucet can mint.
  console.log("Deploying YourToken...");
  const Token = await hre.ethers.getContractFactory("YourToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  // 2. Deploy TokenFaucet
  // GPP Requirement: Faucet must enforce cooldowns and lifetime limits.
  console.log("Deploying TokenFaucet...");
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(tokenAddress);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  // 3. Grant Minter Role (CRITICAL STEP)
  // Only the faucet is allowed to mint tokens for users.
  console.log("Granting minter role to faucet...");
  const tx = await token.setMinter(faucetAddress);
  await tx.wait();
  console.log("Minter role successfully granted to faucet contract.");

  console.log("\n--- DEPLOYMENT COMPLETE ---");
  console.log(`VITE_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`VITE_FAUCET_ADDRESS=${faucetAddress}`);
  console.log("---------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
