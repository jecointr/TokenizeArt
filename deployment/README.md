# Deployment

This folder contains everything required to deploy the `TokenizeArt` ERC-721
contract to **Ethereum Sepolia Testnet** (chainId `11155111`).

## Prerequisites

1. Node.js >= 18 and npm.
2. A wallet with some **SepoliaETH** — get them for free from one of these faucets:
   - [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
   - [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
   - [Infura Faucet](https://www.infura.io/faucet/sepolia)
3. A copy of `code/.env` (from `code/.env.example`) filled with your
   `PRIVATE_KEY` and, optionally, a custom `SEPOLIA_RPC`.

## Install & compile

```bash
cd code
npm install
npx hardhat compile
npx hardhat test        # optional sanity tests on a local Hardhat Network
```

## Deploy to Sepolia

```bash
cd code
npm run deploy
```

The script prints the deployed contract address. Copy it into
`code/.env` as `CONTRACT_ADDRESS=0x...`, and also into the root `README.md`
so the evaluators can find it.

## Verify on Etherscan (optional)

```bash
cd code
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <DEPLOYER_ADDRESS>
```
