// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC721} from "@oz/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@oz/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@oz/access/Ownable.sol";
import {Counters} from "@oz/utils/Counters.sol";

contract Web3Patreon is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint public constant MINT_FEE = 0.5 ether;

    constructor() ERC721("Web3Patreon", "W3P") {}

    // Anyone can Mint
    function safeMint(address to, string memory uri) public payable {
        require(msg.value >= MINT_FEE, "Insufficient Amount");
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Transfer Failed");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://firebasestorage.googleapis.com/v0/b/web3---patreon.appspot.com/o/metadata%2F";
    }
}
