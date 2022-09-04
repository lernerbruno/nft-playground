// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Organization.sol";

contract OrganizationFactory{
    Organization[] public organizations;
    uint orgCount;
    
    constructor(){
        //Do some authentication on who can create org
    }

    function createOrganization(string memory name) public {
        Organization newOrganization = new Organization(name, orgCount);
        organizations.push(newOrganization);
        orgCount ++;
    }

    function getOrganizationContract(uint256 _orgIndex) public view returns (address){
        return address(organizations[_orgIndex]);
    }


    function getOrganizationName(uint256 _orgIndex) public view returns(string memory) {
        return Organization(payable(getOrganizationContract(_orgIndex))).getName();
    }

    function getOrgCount() public view returns (uint) {
        return orgCount;
    }

    function getOrganizations() public view returns (Organization[] memory) {
        return organizations;
    }
}
