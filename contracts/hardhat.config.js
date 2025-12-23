require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

console.log("DEBUG: RPC URL Length:", process.env.SEPOLIA_RPC_URL ? process.env.SEPOLIA_RPC_URL.length : "Undefined");
console.log("DEBUG: Private Key Length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : "Undefined");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};