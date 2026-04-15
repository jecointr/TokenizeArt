require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Secrets are read from a local .env file (never commit it).
// See .env.example for the expected variables.
const { BSC_TESTNET_RPC, PRIVATE_KEY, BSCSCAN_API_KEY } = process.env;

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
    // BNB Smart Chain Testnet — official public RPC as a default.
    bscTestnet: {
      url: BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: BSCSCAN_API_KEY || "",
    },
  },
};
