// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title TokenizeArt — BEP-721 NFT for 42 school project
/// @notice Minimal, audited-base (OpenZeppelin) NFT contract deployed on BSC Testnet.
/// @dev Implements the BEP-721 standard (identical to ERC-721). Only the contract
///      owner can mint, which enforces the "ownership/privileges" requirement of the
///      subject. `ownerOf(tokenId)` is inherited from ERC-721 and lets anyone verify
///      the holder of any given token.
contract TokenizeArt is ERC721URIStorage, Ownable {
    /// @notice Auto-incrementing id used for the next mint.
    uint256 private _nextTokenId;

    /// @param initialOwner Address that receives ownership (mint privilege).
    constructor(address initialOwner)
        ERC721("TokenizeArt42", "TKA42")
        Ownable(initialOwner)
    {}

    /// @notice Mint a new NFT to `to` pointing at an IPFS metadata URI.
    /// @param to  Recipient of the freshly minted token.
    /// @param uri IPFS URI of the token metadata JSON (e.g. ipfs://<CID>/metadata.json).
    /// @return tokenId Id of the newly minted token.
    function safeMint(address to, string memory uri)
        external
        onlyOwner
        returns (uint256 tokenId)
    {
        tokenId = _nextTokenId;
        unchecked { _nextTokenId = tokenId + 1; }
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /// @notice Total number of tokens minted so far (also the next token id).
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }
}
