// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

struct SocialToken {
    uint itemId;
    IERC721 nft;
    uint tokenId;
    uint price;
    address payable socialProject;
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
    // social project address to social tokens
    mapping(address => SocialToken[]) public socialProjectTokens;
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
        address indexed socialProject,
        address indexed seller
    );

    event SocialTokenBought(
        uint itemId,
        address nft,
        uint tokenId,
        uint price,
        address indexed socialProject,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Publish social token for selling in Sogo 
    function makeSocialToken(IERC721 _nft, uint _tokenId, uint _price, address payable socialProject) external nonReentrant {
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
            payable(address(socialProject)),
            payable(msg.sender), 
            false
        );
        // add new item to items mapping
        socialTokens[socialTokensCount] = newSocialToken;
        socialProjectTokens[socialProject].push(newSocialToken);
        
        // emit Offered event
        emit SocialTokenOffered(
            socialTokensCount,
            address(_nft),
            _tokenId,
            _price,
            socialProject,
            msg.sender
        );
    }

    function purchaseSocialToken(uint _itemId) public payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        SocialToken storage item = socialTokens[_itemId];
        require(_itemId > 0 && _itemId <= socialTokensCount, "Social Token doesn't exist");
        require(!item.sold, "item already sold");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(msg.sender != item.seller, "You cannot buy what you are selling");

        // pay seller and feeAccount
        uint sellerShare = uint(item.price/10);
        uint projectShare = uint(item.price*9/10);
        item.seller.transfer(sellerShare);
        item.socialProject.transfer(projectShare);
        feeAccount.transfer(_totalPrice - (sellerShare + projectShare));
        
        // update item to sold and transfer to new owner
        item.nft.transferFrom(address(this), msg.sender, item.itemId);
        item.sold = true;

        // emit Bought event
        emit SocialTokenBought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.socialProject,
            item.seller,
            msg.sender
        );
    }

    function getProjectTokens(address socialProjectAddress) view public returns (SocialToken[] memory) {
        return socialProjectTokens[socialProjectAddress];
    }   

    function getTotalPrice(uint _itemId) view public returns(uint){
        return((socialTokens[_itemId].price*(100 + feePercent))/100);
    }
}
