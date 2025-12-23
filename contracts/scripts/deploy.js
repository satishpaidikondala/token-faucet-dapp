const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy Token
  const token = await hre.ethers.deployContract("FaucetToken");
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  // 2. Deploy Faucet
  const faucet = await hre.ethers.deployContract("TokenFaucet", [tokenAddress]);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  // 3. Grant Minter Role to Faucet
  const MINTER_ROLE = await token.MINTER_ROLE();
  await token.grantRole(MINTER_ROLE, faucetAddress);
  console.log("Minter Role granted to Faucet");

  // Wait before verification (etherscan can be slow to index)
  console.log("Waiting 30s before verification...");
  await new Promise(r => setTimeout(r, 30000));

  // 4. Verify
  await hre.run("verify:verify", { address: tokenAddress });
  await hre.run("verify:verify", { address: faucetAddress, constructorArguments: [tokenAddress] });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});