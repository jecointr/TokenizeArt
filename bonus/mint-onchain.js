// Mints one on-chain NFT from the already-deployed TokenizeArt42OnChain contract.
// No token URI needed — the artwork lives inside the contract itself.
//
// Run from `code/`: `npx hardhat run ../bonus/mint-onchain.js --network bscTestnet`
const hre = require("hardhat");

async function main() {
  const { ONCHAIN_CONTRACT_ADDRESS, MINT_TO } = process.env;
  if (!ONCHAIN_CONTRACT_ADDRESS) {
    throw new Error("ONCHAIN_CONTRACT_ADDRESS is missing in code/.env");
  }

  const [signer] = await hre.ethers.getSigners();
  const recipient = MINT_TO && MINT_TO.length > 0 ? MINT_TO : signer.address;

  const contract = await hre.ethers.getContractAt(
    "TokenizeArt42OnChain",
    ONCHAIN_CONTRACT_ADDRESS,
    signer
  );

  console.log("Minting to", recipient, "...");
  const tx = await contract.safeMint(recipient);
  console.log("Tx:", tx.hash);
  const receipt = await tx.wait();
  console.log("Mined in block:", receipt.blockNumber);

  const tokenId = (await contract.totalMinted()) - 1n;
  console.log("tokenId:", tokenId.toString());
  console.log("owner:  ", await contract.ownerOf(tokenId));
  const uri = await contract.tokenURI(tokenId);
  console.log("tokenURI length:", uri.length, "(data URI, starts with)", uri.slice(0, 40), "...");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
