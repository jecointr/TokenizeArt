# TokenizeArt

> 42 school project — build your own NFT.
> A minimal **BEP-721** collection deployed on **BNB Smart Chain Testnet**,
> with its image and metadata pinned on **IPFS**.

## Repository layout

```
.
├── README.md            # this file
├── code/                # Solidity + Hardhat project (smart contract source)
├── deployment/          # deploy script + instructions
├── mint/                # mint script, ownerOf helper, metadata.json
├── documentation/       # full project documentation
└── bonus/               # bonus chapter: on-chain contract + web dApp
```

## Choices & reasons (subject requirement)

| Decision | Why |
|---|---|
| **BNB Smart Chain Testnet** (chainId `97`) | The subject is a 42 × BNB Chain collaboration. The Testnet is free (tBNB faucet), so no real money is ever at risk. |
| **BEP-721 standard** | BEP-721 is the BNB Chain name for the ERC-721 NFT standard — the de-facto NFT standard on EVM chains. |
| **Solidity `0.8.28` (Cancun)** | Modern stable compiler with built-in overflow checks, custom errors, and `mcopy` (required by OpenZeppelin v5). |
| **OpenZeppelin v5** (`ERC721URIStorage` + `Ownable`) | Battle-tested, audited base contracts. Avoid re-inventing crypto primitives and focus on project-specific logic. |
| **Hardhat + hardhat-toolbox** | Modern replacement for Truffle. Fast compile, in-memory test network, ethers v6, Chai matchers, gas reporter and BscScan verify plugin all in one install. |
| **IPFS for image + metadata** | Required by the subject ("distributed registry technology"). Nothing depends on a centralized server. |
| **`onlyOwner` mint function** | Enforces the "ownership / privileges" security requirement — only the deployer can mint new tokens. |
| **`safeMint` instead of `_mint`** | Makes sure the recipient contract can handle ERC-721 tokens (prevents locked NFTs). |

See [`documentation/README.md`](documentation/README.md) for the full
whitepaper-style write-up.

## Metadata (subject requirement)

The metadata JSON lives in [`mint/metadata.json`](mint/metadata.json) and
satisfies every rule of the subject:

- **Artist** = `jecointr` (42 login)
- **Name**   = `42 Ascending Eagle` (contains the number **42** *and* a title)
- **Image**  = stored on IPFS (`ipfs://<cid>/nft.png`)

## Quick start

```bash
# 1. Install
cd code && npm install

# 2. (optional) local sanity tests
npx hardhat test

# 3. Configure your wallet
cp .env.example .env      # then edit PRIVATE_KEY

# 4. Deploy to BSC Testnet
npm run deploy

# 5. Upload nft.png + metadata.json to IPFS, then set
#    CONTRACT_ADDRESS and TOKEN_URI in code/.env

# 6. Mint the NFT
npm run mint

# 7. Confirm the owner
TOKEN_ID=0 npm run owner
```

Full step-by-step instructions live in
[`deployment/README.md`](deployment/README.md) and
[`mint/README.md`](mint/README.md).

## Public deployment (to fill in after running the scripts)

- **Network**: BNB Smart Chain Testnet (`chainId = 97`)
- **Contract address**: `0x________________________________________`
- **Transaction hash**: `0x________________________________________`
- **BscScan**: `https://testnet.bscscan.com/address/<CONTRACT_ADDRESS>`
- **IPFS image**:    `ipfs://_________________________/nft.png`
- **IPFS metadata**: `ipfs://_________________________/metadata.json`

## Bonus

All three bonuses listed in the subject are implemented — see
[`bonus/README.md`](bonus/README.md):

1. **Beautiful NFT** — a stylized SVG of the number `42`.
2. **Minting website with GUI** — zero-build static dApp in
   [`bonus/webapp/`](bonus/webapp/) using ethers v6 + MetaMask.
3. **Fully on-chain inscriptions** — a second contract
   [`TokenizeArt42OnChain`](code/contracts/TokenizeArt42OnChain.sol)
   that stores metadata and SVG image directly in contract bytecode
   (`data:application/json;base64,...` + `data:image/svg+xml;base64,...`),
   with zero off-chain dependency.

## License

MIT — see the SPDX header in [`code/contracts/TokenizeArt.sol`](code/contracts/TokenizeArt.sol).
