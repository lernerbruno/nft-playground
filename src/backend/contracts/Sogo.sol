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

    // Make Community Fund
    function makeSogoFund(address ong, uint initialDonation, string memory _fundName) external payable nonReentrant {
        uint totalDonation = getTotalPrice(initialDonation);
        require(totalDonation > 0, "initial donation needs to be > 0");
        require(initialDonation <= msg.value, "msg value is lower than initial Donation");        
        fundsCount ++;

        // msg.sender.transfer(ong, initialDonation);
        // msg.sender.transfer(address(this), initialDonation);

        // transfer fee to sogo
        feeAccount.transfer(totalDonation - initialDonation);

        // SogoFund storage newFund = SogoFund.push();
        // newRequest.value = value;
        SogoFund memory newFund = SogoFund ({
            fundId: fundsCount,
            fundName: _fundName, 
            creator: msg.sender,
            org: payable(ong), 
            totalValue: totalDonation
        });
        // newFund.donatisons[msg.sender] = totalDonation;

        // add new item to items mapping
        sogoFunds[fundsCount] = newFund;

        // emit FundCreated event
        emit FundCreated(
            fundsCount,
            msg.sender,
            payable(ong),
            totalDonation
        );
    }

    function donateToFund(uint fundId, uint donationValue) external payable nonReentrant {
        uint totalDonation = getTotalPrice(donationValue);
        require(totalDonation > 0, "initial donation needs to be > 0");
        SogoFund memory sogoFund = sogoFunds[fundId];

        // transfer donation to ong
        sogoFund.org.transfer(donationValue);

        // transfer fee to Sogo
        feeAccount.transfer(totalDonation - donationValue);

        // update Fund total value to sold
        sogoFund.totalValue += donationValue;
        // comFund.donators.append(msg.sender);

        // emit Donation event
        emit DonatedToFund(
            msg.sender,
            fundId,
            donationValue
        );
    }

    // Make NFT art to offer on the community fund
    function makeSogoToken(IERC721 _nft, uint _tokenId, uint _price, address payable beneficiaryNgo) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        sogoArtCount ++;
        sellerTokenCount[msg.sender] ++;
        
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        sogoArts[sogoArtCount] = SogoArt (
            sogoArtCount,
            _nft,
            _tokenId,
            _price,
            beneficiaryNgo,
            payable(msg.sender),
            false
        );
        
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

    function getTotalPrice(uint price) view public returns(uint){
        return(price*(100 + feePercent)/100);
    }
}
