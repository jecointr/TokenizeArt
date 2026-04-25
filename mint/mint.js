// Mints one TokenizeArt NFT on BSC Testnet using the already-deployed contract.
// Reads CONTRACT_ADDRESS, TOKEN_URI and (optional) MINT_TO from code/.env.
//
// Run from the `code/` folder with: `npm run mint`
const hre = require(require.resolve("hardhat", { paths: [process.cwd()] }));

async function main() {
  const { CONTRACT_ADDRESS, TOKEN_URI, MINT_TO } = process.env;

  if (!CONTRACT_ADDRESS) {
    throw new Error("CONTRACT_ADDRESS is missing in code/.env — run `npm run deploy` first.");
  }
  if (!TOKEN_URI) {
    throw new Error(
      "TOKEN_URI is missing in code/.env — upload mint/metadata.json to IPFS first."
    );
  }

  const [signer] = await hre.ethers.getSigners();
  const recipient = MINT_TO && MINT_TO.length > 0 ? MINT_TO : signer.address;

  console.log("Minter:   ", signer.address);
  console.log("Contract: ", CONTRACT_ADDRESS);
  console.log("Recipient:", recipient);
  console.log("Token URI:", TOKEN_URI);

  const contract = await hre.ethers.getContractAt("TokenizeArt", CONTRACT_ADDRESS, signer);
  const tx = await contract.safeMint(recipient, TOKEN_URI);
  console.log("Mint tx:", tx.hash);
  const receipt = await tx.wait();
  console.log("Mined in block:", receipt.blockNumber);

  const minted = await contract.totalMinted();
  const tokenId = minted - 1n;
  console.log("Minted tokenId:", tokenId.toString());
  console.log("ownerOf:       ", await contract.ownerOf(tokenId));
  console.log("tokenURI:      ", await contract.tokenURI(tokenId));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
