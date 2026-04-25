// Minimal dApp — connects to MetaMask, switches to Sepolia, and calls
// `safeMint` on either the IPFS-backed or the fully on-chain TokenizeArt
// contract. No build step: ethers is loaded as an ES module from a CDN so
// you can open `index.html` directly (or serve it with `python3 -m http.server`).
import { BrowserProvider, Contract } from "https://esm.sh/ethers@6.13.2";

// Ethereum Sepolia Testnet network parameters (EIP-3085 / EIP-3326).
const SEPOLIA = {
  chainId: "0xaa36a7", // 11155111
  chainName: "Ethereum Sepolia Testnet",
  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

// Minimal ABIs — only the functions the dApp actually calls.
const ABI_IPFS = [
  "function safeMint(address to, string uri) returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  "function totalMinted() view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
];
const ABI_ONCHAIN = [
  "function safeMint(address to) returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  "function totalMinted() view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
  "function image() view returns (string)",
];

const $ = (id) => document.getElementById(id);
const log = (msg) => { $("log").textContent = msg; };

let provider;
let signer;

function syncUriField() {
  const isOnchain = $("mode").value === "onchain";
  $("uri").classList.toggle("hidden", isOnchain);
  $("uriLabel").classList.toggle("hidden", isOnchain);
}
$("mode").addEventListener("change", syncUriField);
syncUriField();

async function ensureSepolia() {
  const net = await provider.getNetwork();
  if (net.chainId === 11155111n) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA.chainId }],
    });
  } catch (e) {
    if (e.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [SEPOLIA],
      });
    } else {
      throw e;
    }
  }
  provider = new BrowserProvider(window.ethereum);
}

async function tryShowPreview() {
  if ($("mode").value !== "onchain") { $("preview").innerHTML = ""; return; }
  const address = $("contract").value.trim();
  if (!address || !signer) return;
  try {
    const c = new Contract(address, ABI_ONCHAIN, signer);
    const svg = await c.image();
    $("preview").innerHTML = svg;
  } catch { /* contract not ready yet, ignore */ }
}
$("contract").addEventListener("change", tryShowPreview);
$("mode").addEventListener("change", tryShowPreview);

$("connect").addEventListener("click", async () => {
  if (!window.ethereum) {
    log("No Ethereum provider found. Install MetaMask (or a compatible wallet).");
    return;
  }
  try {
    provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    await ensureSepolia();
    signer = await provider.getSigner();
    const me = await signer.getAddress();
    log("Connected as " + me);
    $("mint").disabled = false;
    tryShowPreview();
  } catch (e) {
    log("Error: " + (e.shortMessage || e.message || e));
  }
});

$("mint").addEventListener("click", async () => {
  try {
    const mode = $("mode").value;
    const address = $("contract").value.trim();
    if (!address) { log("Please paste the contract address."); return; }

    const me = await signer.getAddress();
    const to = $("to").value.trim() || me;

    const abi = mode === "ipfs" ? ABI_IPFS : ABI_ONCHAIN;
    const contract = new Contract(address, abi, signer);

    log("Sending mint transaction...");
    const tx = mode === "ipfs"
      ? await contract.safeMint(to, $("uri").value.trim())
      : await contract.safeMint(to);

    log("Tx sent: " + tx.hash + "\nWaiting for confirmation...");
    const receipt = await tx.wait();

    const total = await contract.totalMinted();
    const tokenId = total - 1n;
    const owner = await contract.ownerOf(tokenId);

    log(
      "Minted!\n" +
      "tokenId: " + tokenId + "\n" +
      "owner:   " + owner + "\n" +
      "block:   " + receipt.blockNumber + "\n" +
      "https://sepolia.etherscan.io/tx/" + tx.hash
    );
  } catch (e) {
    log("Error: " + (e.shortMessage || e.message || e));
  }
});
