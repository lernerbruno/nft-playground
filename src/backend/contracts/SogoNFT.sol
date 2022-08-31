// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SogoNFT is ERC721URIStorage{
    uint public tokenCount;
    // map from token id to social project 
    mapping(uint => uint) public communityPerToken;

    constructor() ERC721("SoGo NFT", "SG"){}

    function mint(string memory _tokenURI, uint communityId) external returns(uint) {
        tokenCount ++;
        communityPerToken[tokenCount] = communityId;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }
}