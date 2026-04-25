// Tiny helper script to confirm the owner of a given tokenId, as required by
// the subject ("you need to be able to confirm the owner of an NFT, for
// example using the ownerOf function in Solidity").
//
// Usage (from the `code/` folder):
//   TOKEN_ID=0 npm run owner
const hre = require(require.resolve("hardhat", { paths: [process.cwd()] }));

async function main() {
  const { CONTRACT_ADDRESS } = process.env;
  const tokenId = process.env.TOKEN_ID ?? "0";

  if (!CONTRACT_ADDRESS) {
    throw new Error("CONTRACT_ADDRESS is missing in code/.env");
  }

  const contract = await hre.ethers.getContractAt("TokenizeArt", CONTRACT_ADDRESS);
  const owner = await contract.ownerOf(tokenId);
  const uri = await contract.tokenURI(tokenId);
  console.log(`tokenId ${tokenId}`);
  console.log("  owner   :", owner);
  console.log("  tokenURI:", uri);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
