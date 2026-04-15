const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenizeArt42OnChain (bonus)", function () {
  let contract, owner, alice;

  beforeEach(async function () {
    [owner, alice] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("TokenizeArt42OnChain");
    contract = await Factory.deploy(owner.address);
    await contract.waitForDeployment();
  });

  it("has the expected BEP-721 name / symbol", async function () {
    expect(await contract.name()).to.equal("TokenizeArt42 OnChain");
    expect(await contract.symbol()).to.equal("TKA42OC");
  });

  it("mints and returns a valid base64 JSON tokenURI embedding an SVG", async function () {
    await contract.safeMint(alice.address);
    expect(await contract.ownerOf(0)).to.equal(alice.address);

    const uri = await contract.tokenURI(0);
    expect(uri.startsWith("data:application/json;base64,")).to.equal(true);

    const base64Part = uri.slice("data:application/json;base64,".length);
    const jsonStr = Buffer.from(base64Part, "base64").toString("utf8");
    const meta = JSON.parse(jsonStr);

    expect(meta.name).to.include("42");
    expect(meta.artist).to.equal("jecointr");
    expect(meta.image.startsWith("data:image/svg+xml;base64,")).to.equal(true);

    const svg = Buffer.from(
      meta.image.slice("data:image/svg+xml;base64,".length),
      "base64"
    ).toString("utf8");
    expect(svg).to.include("<svg");
    expect(svg).to.include("42");
    expect(svg).to.include("jecointr");
  });

  it("restricts minting to the owner", async function () {
    await expect(
      contract.connect(alice).safeMint(alice.address)
    ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
  });
});
