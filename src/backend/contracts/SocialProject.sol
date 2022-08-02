// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SocialProject is ERC721URIStorage{
    string public projectName;
    string public ngoName;
    address payable public immutable ngoAccount; // account that will receive the benefits
    uint public expectedDuration;
    uint public actualDuration;
    uint public tokenCount;

    constructor(string memory name, string memory symbol, string memory projName ) ERC721(name, symbol) {
        ngoAccount = payable(msg.sender);
        projectName = projName;
    }

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }
}