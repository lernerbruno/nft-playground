// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./SocialProject.sol";

contract SocialProjectFactory{
    SocialProject[] public socialProjects;
    uint projectsCount;
    
    constructor(){
        //Do some authentication on who can create project
    }

    function createSocialProject(string memory name, string memory purpose, string memory description) public {
        SocialProject newSocialProject = new SocialProject(projectsCount, name, purpose, description);
        socialProjects.push(newSocialProject);
        projectsCount ++;
    }

    function getProjectContract(uint256 _projectIndex) public view returns (address){
        return address(socialProjects[_projectIndex]);
    }

    function getProjectName(uint256 _projectIndex) public view returns(string memory) {
        return SocialProject(payable(getProjectContract(_projectIndex))).getName();
    }

    function getProjectPurpose(uint256 _projectIndex) public view returns(string memory) {
        return SocialProject(payable(getProjectContract(_projectIndex))).getPurpose();
    }

    function getProjectDescription(uint256 _projectIndex) public view returns(string memory) {
        return SocialProject(payable(getProjectContract(_projectIndex))).getDescription();
    }

    function getProjectBalance(uint256 _projectIndex) public view returns(uint256) {
        return SocialProject(payable(getProjectContract(_projectIndex))).getBalance();
    }

    function getDonors(uint256 _projectIndex) public view returns(address[] memory) {
        return SocialProject(payable(getProjectContract(_projectIndex))).getDonors();
    }

    function getDonationsAmounts(uint256 _projectIndex) public view returns(uint256[] memory) {
        return SocialProject(payable(getProjectContract(_projectIndex))).getDonationsAmounts();
    }

    function getSocialProjectsCount() public view returns (uint) {
        return projectsCount;
    }

    function getTotalDonated() public view returns (uint) {
        uint totalDonated;
        for (uint _projectIndex=0; _projectIndex<projectsCount; _projectIndex++) {
            totalDonated += SocialProject(payable(getProjectContract(_projectIndex))).getBalance();
        }
        return totalDonated;
    }

    function getSocialProjects() public view returns (SocialProject[] memory) {
        return socialProjects;
    }

    function donateToProject(uint256 _projectIndex, uint256 _amount) public payable {
        return SocialProject(payable(getProjectContract(_projectIndex))).directDonate(_amount);
    } 
}
