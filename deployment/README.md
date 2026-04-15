# Deployment

This folder contains everything required to deploy the `TokenizeArt` BEP-721
contract to the **BNB Smart Chain Testnet** (chainId `97`).

## Prerequisites

1. Node.js ≥ 18 and npm.
2. A wallet with some **tBNB** — get them for free from the
   [BNB Chain Faucet](https://www.bnbchain.org/en/testnet-faucet).
3. A copy of `code/.env` (from `code/.env.example`) filled with your
   `PRIVATE_KEY` and, optionally, a custom `BSC_TESTNET_RPC`.

## Install & compile

```bash
cd code
npm install
npx hardhat compile
npx hardhat test        # optional sanity tests on a local Hardhat Network
```

## Deploy to BSC Testnet

```bash
cd code
npm run deploy
```

The script prints the deployed contract address. Copy it into
`code/.env` as `CONTRACT_ADDRESS=0x...`, and also into the root `README.md`
so the evaluators can find it.

## Verify on BscScan (optional)

```bash
cd code
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> <DEPLOYER_ADDRESS>
```
