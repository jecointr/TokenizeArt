# Mint

This folder groups the files needed to **mint** one token of the deployed
`TokenizeArt` BEP-721 collection on BSC Testnet.

## 1. Upload the image to IPFS

Pick any IPFS provider (Pinata, web3.storage, NFT.storage, a local
`ipfs` node…). Upload `nft.png` (the artwork containing the number `42`)
and copy the returned CID, e.g. `bafybeigdyr...`.

## 2. Patch `metadata.json`

Replace `REPLACE_WITH_IMAGE_CID` in `metadata.json` with the CID from
step 1 so the `image` field points at `ipfs://<imageCid>/nft.png`.

The metadata already enforces every rule from the subject:

- `artist` = `jecointr` (your 42 login)
- `name`   = `42 Ascending Eagle` (contains `42` **and** a title)

## 3. Upload `metadata.json` to IPFS

Upload the patched file to IPFS as well. Copy the new CID and set
`TOKEN_URI=ipfs://<metadataCid>/metadata.json` in `code/.env`.

## 4. Mint

```bash
cd code
npm run mint
```

The script uses the contract address and token URI from `code/.env`,
calls `safeMint(to, uri)`, and prints the resulting `tokenId`, `ownerOf`
and `tokenURI`.

## 5. Confirm ownership

```bash
cd code
TOKEN_ID=0 npm run owner
```

This calls the ERC-721 `ownerOf(tokenId)` view function — the exact
check the subject asks for.

## 6. View the NFT

- BscScan: `https://testnet.bscscan.com/address/<CONTRACT_ADDRESS>`
- Any BEP-721 compatible wallet connected to BSC Testnet will fetch
  the metadata from IPFS and display the image.
