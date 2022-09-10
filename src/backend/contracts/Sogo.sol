// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

struct SogoFund {
    uint fundId;
    string fundName;
    address creator;
    // mapping(address => uint) donations;
    // mapping(address => uint) ngoGrants;
    address payable org;
    uint totalValue;
}

struct SogoArt {
    uint SogoArtId;
    IERC721 nft;
    uint tokenId;
    uint price;
    address payable beneficiaryNgo;
    address payable seller;
    bool sold;
}

contract Sogo is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public fundsCount;
    uint public sogoArtCount;
    
    // fundId -> SogoFund
    mapping(uint => SogoFund) public sogoFunds;
    // sogo token id -> community id
    mapping(uint => uint) public tokenToCommunity;
    // nft seller token count
    mapping(address => uint) public sellerTokenCount;
    // beneficiary org to tokens
    mapping(address => SogoArt[]) public orgTokens;
    // sogoArtId -> sogoArt
    mapping(uint => SogoArt) public sogoArts;

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

    event SogoArtOffered(
        uint sogoArtId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed beneficiaryNgo,
        address indexed seller
    );

    event SogoArtBought(
        uint sogoArtId,
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

    // Make NFT art to offer on the community fund
    function makeSogoToken(IERC721 _nft, uint _tokenId, uint _price, address payable beneficiaryNgo) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        sogoArtCount ++;
        sellerTokenCount[msg.sender] ++;
        
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        
        SogoArt memory newSogoArt = SogoArt (
            sogoArtCount,
            _nft,
            _tokenId,
            _price,
            beneficiaryNgo,
            payable(msg.sender),
            false
        );
        // add new item to items mapping
        sogoArts[sogoArtCount] = newSogoArt;
        orgTokens[beneficiaryNgo].push(newSogoArt);
        
        // emit Offered event
        emit SogoArtOffered(
            sogoArtCount,
            address(_nft),
            _tokenId,
            _price,
            beneficiaryNgo,
            msg.sender
        );
    }

    function purchaseSogoArt(uint _itemId) public payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        SogoArt storage item = sogoArts[_itemId];
        require(_itemId > 0 && _itemId <= sogoArtCount, "Sogo Art doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit SogoArtBought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.beneficiaryNgo,
            item.seller,
            msg.sender
        );
    }

    function getOrgTokens(address orgAddress) view public returns (SogoArt[] memory) {
        return orgTokens[orgAddress];
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return((sogoArts[_itemId].price*(100 + feePercent))/100);
    }

    // // Make Community Fund
    // function makeSogoFund(address ong, uint initialDonation, string memory _fundName) external payable nonReentrant {
    //     uint totalDonation = getTotalPrice(initialDonation);
    //     require(totalDonation > 0, "initial donation needs to be > 0");
    //     require(initialDonation <= msg.value, "msg value is lower than initial Donation");        
    //     fundsCount ++;

    //     // msg.sender.transfer(ong, initialDonation);
    //     // msg.sender.transfer(address(this), initialDonation);

    //     // transfer fee to sogo
    //     feeAccount.transfer(totalDonation - initialDonation);

    //     // SogoFund storage newFund = SogoFund.push();
    //     // newRequest.value = value;
    //     SogoFund memory newFund = SogoFund ({
    //         fundId: fundsCount,
    //         fundName: _fundName, 
    //         creator: msg.sender,
    //         org: payable(ong), 
    //         totalValue: totalDonation
    //     });
    //     // newFund.donatisons[msg.sender] = totalDonation;

    //     // add new item to items mapping
    //     sogoFunds[fundsCount] = newFund;

    //     // emit FundCreated event
    //     emit FundCreated(
    //         fundsCount,
    //         msg.sender,
    //         payable(ong),
    //         totalDonation
    //     );
    // }

    // function donateToFund(uint fundId, uint donationValue) external payable nonReentrant {
    //     uint totalDonation = getTotalPrice(donationValue);
    //     require(totalDonation > 0, "initial donation needs to be > 0");
    //     SogoFund memory sogoFund = sogoFunds[fundId];

    //     // transfer donation to ong
    //     sogoFund.org.transfer(donationValue);

    //     // transfer fee to Sogo
    //     feeAccount.transfer(totalDonation - donationValue);

    //     // update Fund total value to sold
    //     sogoFund.totalValue += donationValue;
    //     // comFund.donators.append(msg.sender);

    //     // emit Donation event
    //     emit DonatedToFund(
    //         msg.sender,
    //         fundId,
    //         donationValue
    //     );
    // }

}
