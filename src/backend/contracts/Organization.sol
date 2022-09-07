// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Organization {
    struct Claim {
        string firstName;
        string lastName;
        string eMail;
        address desiredWallet;
    }
    event CashOutComplete(uint256 cashOutAmount);
    event ClaimCreated(string claimId, Claim claim);
    event ClaimApproved(string claimId, Claim claim);
    event ClaimRejected(string claimId, Claim claim);

    string public orgName;
    string public purpose;
    string public description;
    uint256 public orgId;
    uint256 balance;
    mapping(address => uint256) public donations;

    
    mapping(string => Claim) public pendingClaims; // claim UUID to Claim
    Claim public activeClaim;
    
    constructor(uint _orgId, string memory _orgName, string memory _purpose, string memory _description) {
        orgName = _orgName;
        orgId = _orgId;
        purpose = _purpose;
        description = _description;
    }

    function withdraw(uint _amount) external {
        // require(msg.sender == ongAccount, "caller is not owner");
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() external view returns (uint256) {
        // When we'll have more tokens:
        // IERC20 tokenContract = IERC20(tokenAddress);
        // uint256 balance = tokenContract.balanceOf(address(this));
        return balance;
    }

    function getName() public view returns (string memory){
        return orgName;
    }

    function getPurpose() public view returns (string memory){
        return purpose;
    }

    function getDescription() public view returns (string memory){
        return description;
    }

    function directDonate(uint256 _amount) public payable {
        // require(msg.value >= _amount, "not enough ether to donate this amount");
        // payable(address(this)).transfer(msg.value);
        donations[msg.sender] += _amount;
        balance += _amount;
    }

    // function getPrice() public view returns(uint256){
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    //     (,int256 answer,,,) = priceFeed.latestRoundData();
    //      // ETH/USD rate in 18 digit 
    //      return uint256(answer * 10000000000);
    // }

    // function getConversionRate(uint256 ethAmount) public view returns (uint256){
    //     uint256 ethPrice = getPrice();
    //     uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
    //     // the actual ETH/USD conversation rate, after adjusting the extra 0s.
    //     return ethAmountInUsd;
    // }
}
