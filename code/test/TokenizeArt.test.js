const { expect } = require("chai");
const { ethers } = require("hardhat");

// Sanity tests — run them locally with `npx hardhat test`. They do NOT touch
// BSC Testnet, they spin up a fresh in-memory Hardhat Network instead.
describe("TokenizeArt", function () {
  let contract, owner, alice, bob;
  const TOKEN_URI = "ipfs://bafy-fake-cid/metadata.json";

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("TokenizeArt");
    contract = await Factory.deploy(owner.address);
    await contract.waitForDeployment();
  });

  it("exposes the expected BEP-721 name & symbol", async function () {
    expect(await contract.name()).to.equal("TokenizeArt42");
    expect(await contract.symbol()).to.equal("TKA42");
  });

  it("lets the owner mint and exposes ownerOf / tokenURI", async function () {
    await contract.safeMint(alice.address, TOKEN_URI);
    expect(await contract.ownerOf(0)).to.equal(alice.address);
    expect(await contract.tokenURI(0)).to.equal(TOKEN_URI);
    expect(await contract.totalMinted()).to.equal(1n);
  });

  it("prevents non-owners from minting", async function () {
    await expect(
      contract.connect(bob).safeMint(bob.address, TOKEN_URI)
    ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
  });

  it("supports standard ERC-721 transfers", async function () {
    await contract.safeMint(alice.address, TOKEN_URI);
    await contract
      .connect(alice)
      .transferFrom(alice.address, bob.address, 0);
    expect(await contract.ownerOf(0)).to.equal(bob.address);
  });
});
