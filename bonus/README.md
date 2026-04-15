# Bonus

This folder gathers every bonus item listed in the subject (chapter V):

1. **A beautiful NFT** — a stylized SVG of the number **42** with a radial
   grid, gradient background, and a subtle color-shift from sky blue to
   violet. It is signed with the artist login `jecointr`. The SVG is
   re-used as the artwork of the fully on-chain contract (see #3) and is
   rendered directly in the dApp preview (see #2).
2. **A minting website with a graphical interface** — a dependency-free
   static dApp in [`webapp/`](webapp/). Connect MetaMask, pick either
   the IPFS or the on-chain contract, paste the address, and mint.
3. **Fully on-chain NFT inscriptions** — a second contract,
   [`TokenizeArt42OnChain.sol`](../code/contracts/TokenizeArt42OnChain.sol),
   that stores both the metadata and the SVG image directly inside the
   contract bytecode. `tokenURI` returns a `data:application/json;base64`
   URI embedding a `data:image/svg+xml;base64` image, so nothing lives
   off-chain — no IPFS, no HTTP, no server.

> ⚠️ The bonus part is only evaluated if the mandatory part is **perfect**.
> Make sure the main contract is deployed, the NFT is minted, and the
> public address + IPFS CIDs are filled in the root `README.md` before
> claiming bonus points.

## 1. Fully on-chain contract

### Why it matters

The mandatory contract points at IPFS, which is already distributed, but
if the CID ever becomes unpinned the artwork effectively disappears.
The on-chain variant removes that failure mode: as long as the BSC
Testnet exists, the NFT (artwork included) exists.

### How it works

- The SVG is declared as a Solidity `string constant` — it never leaves
  the contract bytecode.
- `tokenURI(tokenId)` builds the JSON on the fly, Base64-encodes it, and
  prepends `data:application/json;base64,`. The `image` field inside
  the JSON is itself a `data:image/svg+xml;base64,...` URI.
- All modern wallets, explorers, and marketplaces understand data URIs
  out of the box.
- Same security model as the mandatory contract: `onlyOwner` minting,
  `_safeMint`, no fallback, no `delegatecall`.

### Deploy & mint

Both commands are wired into `code/package.json`, so run them from the
`code/` folder:

```bash
cd code
npm install           # if you haven't already
npx hardhat test      # 7 tests should pass

npm run deploy:onchain
# copy the printed address into code/.env as ONCHAIN_CONTRACT_ADDRESS=...

npm run mint:onchain
# the script prints tokenId, owner, and a truncated tokenURI
```

### Inspect the result

```bash
# Full data URI (long!)
cd code
npx hardhat console --network bscTestnet
> const c = await ethers.getContractAt("TokenizeArt42OnChain", process.env.ONCHAIN_CONTRACT_ADDRESS)
> await c.tokenURI(0)
```

Paste the returned `data:application/json;base64,...` string into any
browser address bar to see the raw JSON metadata. Paste the inner
`data:image/svg+xml;base64,...` to see the artwork.

## 2. Web dApp

A **zero-build**, three-file static site in [`webapp/`](webapp/):

```
webapp/
├── index.html   # layout
├── style.css    # theme
└── app.js       # ethers v6 (loaded from esm.sh), MetaMask flow
```

### Run it

```bash
cd bonus/webapp
python3 -m http.server 8080
# then open http://localhost:8080
```

Or simply double-click `index.html` (works with most browsers because
ethers is loaded from `https://esm.sh`).

### Features

- **Connect wallet** button → requests accounts from MetaMask and
  auto-switches to BSC Testnet (adds the network via EIP-3085 if the
  user does not have it yet).
- **Contract variant** selector → pick the IPFS-backed contract or the
  fully on-chain one. The `tokenURI` field is hidden automatically when
  the on-chain variant is selected (no URI needed).
- **Live SVG preview** → when you paste the address of the on-chain
  contract, the dApp calls `image()` and renders the artwork inline.
- **Mint** button → sends the transaction, waits for it to be mined,
  and then calls `ownerOf` + `totalMinted` to confirm the result. A
  BscScan link is printed so the evaluator can double-check.
- **No secrets in the browser** → the private key never leaves the
  wallet; the dApp only talks to MetaMask's injected provider.

## 3. Beautiful NFT

Tastes vary, but the artwork in the on-chain contract is:

- Pure SVG → vector, infinite resolution, reproducible bit-for-bit.
- A deep-blue radial grid in the background, echoing the 42 cosmic vibe.
- A giant `42` number in a linear gradient from sky blue to violet.
- The `TOKENIZEART` wordmark and the `by jecointr` signature at the
  bottom.
- Small enough to comfortably live inside the contract bytecode.

You can extract it anytime:

```bash
cd code
npx hardhat console --network bscTestnet
> const c = await ethers.getContractAt("TokenizeArt42OnChain", process.env.ONCHAIN_CONTRACT_ADDRESS)
> require("fs").writeFileSync("/tmp/nft.svg", await c.image())
```
