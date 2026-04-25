// Deploys the fully on-chain bonus contract (TokenizeArt42OnChain) to BSC Testnet.
// Run from the `code/` folder: `npx hardhat run ../bonus/deploy-onchain.js --network sepolia`
const hre = require(require.resolve("hardhat", { paths: [process.cwd()] }));

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TokenizeArt42OnChain with:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("TokenizeArt42OnChain");
  const contract = await Factory.deploy(deployer.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TokenizeArt42OnChain deployed at:", address);
  console.log("Network:", hre.network.name, "chainId:", hre.network.config.chainId);
  console.log("\nNext: add ONCHAIN_CONTRACT_ADDRESS=" + address + " to code/.env");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
