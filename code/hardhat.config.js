require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Secrets are read from a local .env file (never commit it).
// See .env.example for the expected variables.
const { SEPOLIA_RPC, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    // Default local Hardhat Network for tests / dry-runs.
    hardhat: {},
    // Ethereum Sepolia Testnet — free faucet, no minimum balance required.
    sepolia: {
      url: SEPOLIA_RPC || "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY || "",
    },
  },
};
