//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SampleToken is ERC721 {
    string private _baseUri; // base URI for computing {tokenURI}

    uint256 public TOTAL_SUPPLY = 10;

    using Counters for Counters.Counter; // used to set the token ids
    Counters.Counter private _tokenIdCounter;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_
    ) ERC721(name_, symbol_) {
        _baseUri = baseURI_;
        _tokenIdCounter.increment(); // starts from 1
    }

    /**
     * @dev Mints a new token with the current counter id, assigns it to `to` and increments the counter.
     *
     * Requirements:
     * - Only the owner can mint new tokens.
     *
     * @param to The holder of the new token
     */
    function mint(address to) public {
        require( _tokenIdCounter.current() <= TOTAL_SUPPLY, "Already reached the maximum amount of NFTs");

        _safeMint(to, _tokenIdCounter.current());

        _tokenIdCounter.increment();
    }
}
