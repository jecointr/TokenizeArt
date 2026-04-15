# TokenizeArt — Documentation

## 1. What is this project?

`TokenizeArt` is a minimal **non-fungible token** built for the 42 school
project of the same name. It follows the **BEP-721** standard (the BNB
Smart Chain flavor of ERC-721) and is deployed on the **BSC Testnet**,
so no real money is ever involved.

The collection contains a single artwork (edition `1 of 1`) featuring
the number **42**. Its metadata and image are pinned to **IPFS**, so
neither the image nor the description rely on a centralized server.

## 2. Architecture

```
TokenizeArt/
├── README.md            # project overview, contract address, network
├── code/                # Solidity + Hardhat project
│   ├── contracts/       # TokenizeArt.sol (BEP-721 w/ OpenZeppelin base)
│   ├── test/            # Hardhat unit tests
│   ├── hardhat.config.js
│   └── package.json
├── deployment/          # deploy.js + instructions
├── mint/                # mint.js, ownerOf.js, metadata.json + instructions
└── documentation/       # you are here
```

### Smart contract

- **Language**: Solidity `0.8.28` (Cancun EVM target)
- **Base libraries**: OpenZeppelin v5 (`ERC721URIStorage`, `Ownable`)
- **Standard**: BEP-721 (fully compatible with ERC-721, same ABI)
- **Name / symbol**: `TokenizeArt42` / `TKA42`
- **Privileged functions**: only the contract `owner` can `safeMint`.
- **Public view functions**: `ownerOf`, `tokenURI`, `balanceOf`,
  `totalMinted`, `name`, `symbol`, plus the rest of the ERC-721 surface.

### Metadata (OpenSea-compatible)

```json
{
  "name": "42 Ascending Eagle",
  "description": "...",
  "image": "ipfs://<imageCid>/nft.png",
  "artist": "jecointr",
  "attributes": [
    { "trait_type": "Artist",     "value": "jecointr" },
    { "trait_type": "Collection", "value": "TokenizeArt42" },
    { "trait_type": "Title",      "value": "Ascending Eagle" },
    { "trait_type": "Edition",    "value": "1 of 1" },
    { "trait_type": "School",     "value": "42" }
  ]
}
```

This satisfies every metadata requirement of the subject:

- The **artist** field is the 42 login `jecointr`.
- The **name** contains the number `42` **and** a title
  (`Ascending Eagle`).

## 3. Why BNB Smart Chain + Hardhat?

- **BNB Smart Chain** is the platform suggested by the subject preamble
  (the project is a 42 × BNB Chain collaboration), and the public
  **Testnet faucet** avoids spending any real money.
- **Hardhat** is the modern, TypeScript-friendly replacement for
  Truffle — faster compilation, a built-in local network, and a great
  plugin ecosystem (`hardhat-toolbox` bundles ethers v6, Chai matchers,
  gas reporter and the verify plugin).
- **OpenZeppelin** is the reference, audited implementation of
  ERC-721 / BEP-721. Reusing it is by far the safest option and lets
  the contract focus on the bits that are actually project-specific
  (the custom `safeMint` with owner-gating).
- **IPFS** is the distributed registry required by the subject; any
  node on the network can serve the image and metadata so the NFT
  never depends on a single server.

## 4. Security considerations

- `safeMint` is gated by `onlyOwner`, so random users cannot inflate
  the supply. Ownership can be transferred with `transferOwnership`
  or revoked permanently with `renounceOwnership`.
- `_safeMint` (from OpenZeppelin) is used instead of the raw `_mint`
  to make sure the recipient is able to handle ERC-721 tokens (prevents
  tokens from being locked in non-aware contracts).
- Token ids are generated from a monotonically increasing counter in
  an `unchecked` block; overflow is impossible in practice (`2^256`).
- The private key used to deploy and mint is loaded from a `.env`
  file that is git-ignored. The example file (`.env.example`) contains
  placeholders only — no real secret is ever committed.
- No `selfdestruct`, no `delegatecall`, no assembly — the attack
  surface is intentionally kept to a minimum.

## 5. How to use it

1. **Install dependencies** — from `code/`, run `npm install`.
2. **Compile** — `npx hardhat compile`.
3. **Test locally** — `npx hardhat test` (uses the in-memory network).
4. **Deploy to BSC Testnet** — `npm run deploy`.
5. **Upload image + metadata to IPFS** — see `mint/README.md`.
6. **Mint** — `npm run mint`.
7. **Check the owner** — `TOKEN_ID=0 npm run owner`.
8. **Display** — open
   `https://testnet.bscscan.com/address/<CONTRACT_ADDRESS>` or import
   the contract in a BEP-721-aware wallet (MetaMask + BSC Testnet).

## 6. Public deployment

Fill these in once the contract is deployed:

- **Network**: BNB Smart Chain Testnet (`chainId = 97`)
- **Contract address**: `0x...` *(to be filled after deployment)*
- **Transaction hash**: `0x...`
- **Minter / owner**: `0x...`
- **IPFS image CID**:    `ipfs://...`
- **IPFS metadata CID**: `ipfs://.../metadata.json`

## 7. FAQ

**Why BEP-721 and not ERC-721?** — They are the exact same standard.
"BEP-721" is simply the name BNB Chain uses for ERC-721 tokens
deployed on BSC. The ABI and bytecode are 100% compatible.

**Why only one token?** — The subject only asks for a single NFT.
Keeping the scope minimal makes the demonstration easier and the
security model trivial to reason about. The `safeMint` function can
still be called multiple times to create more tokens if needed.

**Can I transfer the NFT?** — Yes, the standard `transferFrom` and
`safeTransferFrom` are inherited from OpenZeppelin's ERC-721
implementation.
