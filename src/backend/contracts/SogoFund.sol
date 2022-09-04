// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


contract SogoFund {
    address public fundCreator;
    address[] public funders;
    address public balance;
    mapping(address => uint256) contributions;
    
    constructor(address _fundCreator) {
        fundCreator = _fundCreator;
    }

}