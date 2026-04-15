// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title TokenizeArt42OnChain — fully on-chain BEP-721 NFT
/// @notice Bonus variant of the TokenizeArt collection. Unlike the IPFS version,
///         both the metadata JSON and the artwork (an SVG) live entirely inside
///         the contract storage. The contract depends on NO off-chain resource:
///         no IPFS gateway, no HTTP server, no centralized host.
/// @dev `tokenURI` returns a `data:application/json;base64,...` URI embedding a
///      `data:image/svg+xml;base64,...` image. Any standard NFT viewer (wallets,
///      BscScan, OpenSea-compatible marketplaces) can render it out of the box.
contract TokenizeArt42OnChain is ERC721, Ownable {
    using Strings for uint256;

    /// @notice Auto-incrementing id used for the next mint.
    uint256 private _nextTokenId;

    /// @dev Hard-coded artwork. An SVG containing the number 42 (subject
    ///      requirement) plus the artist login. Stored as an immutable constant
    ///      so it never leaves the contract bytecode.
    string private constant _SVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">'
        '<defs>'
          '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
            '<stop offset="0" stop-color="#0b1020"/>'
            '<stop offset="1" stop-color="#1b3a8a"/>'
          '</linearGradient>'
          '<linearGradient id="num" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#7dd3fc"/>'
            '<stop offset="1" stop-color="#c084fc"/>'
          '</linearGradient>'
        '</defs>'
        '<rect width="500" height="500" fill="url(#bg)"/>'
        '<g stroke="#ffffff22" stroke-width="1" fill="none">'
          '<circle cx="250" cy="250" r="200"/>'
          '<circle cx="250" cy="250" r="150"/>'
          '<circle cx="250" cy="250" r="100"/>'
          '<line x1="0" y1="250" x2="500" y2="250"/>'
          '<line x1="250" y1="0" x2="250" y2="500"/>'
        '</g>'
        '<text x="250" y="335" font-family="Helvetica,Arial,sans-serif" '
        'font-size="260" font-weight="900" text-anchor="middle" '
        'fill="url(#num)">42</text>'
        '<text x="250" y="420" font-family="Helvetica,Arial,sans-serif" '
        'font-size="28" letter-spacing="8" text-anchor="middle" '
        'fill="#e2e8f0">TOKENIZEART</text>'
        '<text x="250" y="455" font-family="Helvetica,Arial,sans-serif" '
        'font-size="16" letter-spacing="4" text-anchor="middle" '
        'fill="#94a3b8">by jecointr</text>'
        '</svg>';

    string private constant _NFT_NAME = "42 Ascending Eagle";
    string private constant _NFT_DESCRIPTION =
        "Fully on-chain TokenizeArt NFT minted for the 42 school project. "
        "Both the metadata and the artwork SVG live entirely inside the "
        "contract storage - no IPFS, no HTTP, no off-chain dependency.";
    string private constant _ARTIST = "jecointr";

    constructor(address initialOwner)
        ERC721("TokenizeArt42 OnChain", "TKA42OC")
        Ownable(initialOwner)
    {}

    /// @notice Mint a new on-chain NFT to `to`. No URI parameter is needed —
    ///         `tokenURI` is computed from the contract storage itself.
    function safeMint(address to) external onlyOwner returns (uint256 tokenId) {
        tokenId = _nextTokenId;
        unchecked { _nextTokenId = tokenId + 1; }
        _safeMint(to, tokenId);
    }

    /// @notice Number of tokens minted so far (also the next token id).
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }

    /// @notice Raw SVG string — handy for frontends that want to render the
    ///         artwork without decoding the `tokenURI` data URI.
    function image() external pure returns (string memory) {
        return _SVG;
    }

    /// @inheritdoc ERC721
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireOwned(tokenId);

        string memory imageBase64 = Base64.encode(bytes(_SVG));
        string memory json = string(
            abi.encodePacked(
                '{"name":"', _NFT_NAME, ' #', tokenId.toString(),
                '","description":"', _NFT_DESCRIPTION,
                '","artist":"', _ARTIST,
                '","image":"data:image/svg+xml;base64,', imageBase64,
                '","attributes":[',
                    '{"trait_type":"Artist","value":"jecointr"},',
                    '{"trait_type":"Collection","value":"TokenizeArt42"},',
                    '{"trait_type":"Title","value":"Ascending Eagle"},',
                    '{"trait_type":"Storage","value":"Fully on-chain"},',
                    '{"trait_type":"School","value":"42"}',
                ']}'
            )
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }
}
