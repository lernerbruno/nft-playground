// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

struct SocialToken {
    uint itemId;
    IERC721 nft;
    uint price;
    uint tokenId;
    address payable beneficiaryNgo;
    address payable seller;
    bool sold;
}

contract Sogo is ReentrancyGuard {
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public fundsCount;
    uint public socialTokensCount;
    // nft seller token count
    mapping(address => uint) public sellerTokenCount;
    // beneficiary org to tokens
    mapping(address => SocialToken[]) public orgTokens;
    // itemId -> socialToken
    mapping(uint => SocialToken) public socialTokens;

    event DonatedToFund(
        address indexed donor,
        uint communityId,
        uint value
    );

    event FundCreated(    
        uint communityId,
        address creator,
        address payable ong,
        uint totalValue
    );

    event SocialTokenOffered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed beneficiaryNgo,
        address indexed seller
    );

    event SocialTokenBought(
        uint itemId,
        address nft,
        uint tokenId,
        uint price,
        address indexed beneficiaryNgo,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Publish social token for selling in Sogo 
    function makeSogoToken(IERC721 _nft, uint _tokenId, uint _price, address payable beneficiaryNgo) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        socialTokensCount ++;
        sellerTokenCount[msg.sender] ++;
        
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        
        SocialToken memory newSocialToken = SocialToken (
            socialTokensCount,
            _nft,
            _tokenId,
            _price,
            beneficiaryNgo,
            payable(msg.sender),
            false
        );
        // add new item to items mapping
        socialTokens[socialTokensCount] = newSocialToken;
        orgTokens[beneficiaryNgo].push(newSocialToken);
        
        // emit Offered event
        emit SocialTokenOffered(
            socialTokensCount,
            address(_nft),
            _tokenId,
            _price,
            beneficiaryNgo,
            msg.sender
        );
    }

    function purchaseSogoArt(uint _itemId) public payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        SocialToken storage item = socialTokens[_itemId];
        require(_itemId > 0 && _itemId <= socialTokensCount, "Sogo Art doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        item.beneficiaryNgo.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit SocialTokenBought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.beneficiaryNgo,
            item.seller,
            msg.sender
        );
    }

    function getOrgTokens(address orgAddress) view public returns (SocialToken[] memory) {
        return orgTokens[orgAddress];
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return((socialTokens[_itemId].price*(100 + feePercent))/100);
    }
}
