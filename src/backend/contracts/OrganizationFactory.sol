// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Organization.sol";

contract OrganizationFactory{
    Organization[] public organizations;
    uint orgCount;
    
    constructor(){
        //Do some authentication on who can create org
    }

    function createOrganization(string memory name, string memory purpose, string memory description) public {
        Organization newOrganization = new Organization(orgCount, name, purpose, description);
        organizations.push(newOrganization);
        orgCount ++;
    }

    function getOrganizationContract(uint256 _orgIndex) public view returns (address){
        return address(organizations[_orgIndex]);
    }

    function getOrganizationName(uint256 _orgIndex) public view returns(string memory) {
        return Organization(payable(getOrganizationContract(_orgIndex))).getName();
    }

    function getOrganizationPurpose(uint256 _orgIndex) public view returns(string memory) {
        return Organization(payable(getOrganizationContract(_orgIndex))).getPurpose();
    }

    function getOrganizationDescription(uint256 _orgIndex) public view returns(string memory) {
        return Organization(payable(getOrganizationContract(_orgIndex))).getDescription();
    }

    function getOrganizationBalance(uint256 _orgIndex) public view returns(uint256) {
        return Organization(payable(getOrganizationContract(_orgIndex))).getBalance();
    }

    function getDonors(uint256 _orgIndex) public view returns(address[] memory) {
        return Organization(payable(getOrganizationContract(_orgIndex))).getDonors();
    }

    function getDonationsAmounts(uint256 _orgIndex) public view returns(uint256[] memory) {
        return Organization(payable(getOrganizationContract(_orgIndex))).getDonationsAmounts();
    }

    function getOrgCount() public view returns (uint) {
        return orgCount;
    }

    function getOrganizations() public view returns (Organization[] memory) {
        return organizations;
    }

    function donateToOrganization(uint256 _orgIndex, uint256 _amount) public payable {
        return Organization(payable(getOrganizationContract(_orgIndex))).directDonate(_amount);
    } 
}
