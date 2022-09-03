// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IFactory.sol";

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

    address payable public ongAccount;
    string public orgName;
    IFactory public orgFactory;
    uint256 public orgId;
    mapping(string => Claim) public pendingClaims; // claim UUID to Claim
    Claim public activeClaim;
    
    constructor(string memory _orgName, uint256 _orgId) {
        ongAccount = payable(msg.sender);
        orgName = _orgName;
        orgId = _orgId;
    }

    // // Constructor
    // /**
    // * @notice Create new Organization
    // * @dev Using initializer instead of constructor for minimal proxy support. This function
    // * can only be called once in the contract's lifetime
    // * @param _ongId NGO Identification Number
    // * @param _orgFactory Address of the Factory contract.
    // */
    // function initializeOrg(uint256 _ongId, address _orgFactory) public initializer {
    //     require(orgFactory != address(0), "Organization: Factory address is null.");
    //     ongId = _ongId;
    //     orgFactory = IFactory(_orgFactory);
    // }

    receive() external payable {}

    function withdraw(uint _amount) external {
        require(msg.sender == ongAccount, "caller is not owner");
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() external view returns (uint) {
        // When we'll have more tokens:
        // IERC20 tokenContract = IERC20(tokenAddress);
        // uint256 balance = tokenContract.balanceOf(address(this));
        return address(this).balance;
    }
}
