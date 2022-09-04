// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./SogoFund.sol";

contract SogoFundFactory{
    SogoFund[] public sogoFunds;
    uint fundCount;
    
    constructor(){
        //Do some authentication on who can create org
    }

    function createSogoFund(address fundCreator) public {
        SogoFund newFund = new SogoFund(fundCreator);
        sogoFunds.push(newFund);
        fundCount ++;
    }

    function getFundContract(uint256 _fundIndex) public view returns (address){
        return address(sogoFunds[_fundIndex]);
    }

    function getFundCount() public view returns (uint) {
        return fundCount;
    }

    function getSogoFunds() public view returns (SogoFund[] memory) {
        return sogoFunds;
    }
}
