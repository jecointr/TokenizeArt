// Deployment script for the TokenizeArt BEP-721 contract on BSC Testnet.
// Run from the `code/` folder with: `npm run deploy`
//
// After success, copy the printed address into `code/.env` (CONTRACT_ADDRESS)
// and into the root README.md / documentation.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TokenizeArt with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "tBNB");

  const Factory = await hre.ethers.getContractFactory("TokenizeArt");
  const contract = await Factory.deploy(deployer.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TokenizeArt deployed at:", address);
  console.log("Network:", hre.network.name, "chainId:", hre.network.config.chainId);
  console.log("\nNext steps:");
  console.log(`  1. Add CONTRACT_ADDRESS=${address} to code/.env`);
  console.log("  2. Upload the image + metadata.json to IPFS (see mint/README.md)");
  console.log("  3. Run `npm run mint` from the code/ folder");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
