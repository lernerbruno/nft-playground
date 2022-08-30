// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Organization {
    address payable public ongAccount;

    constructor() {
        ongAccount = payable(msg.sender);
    }

    receive() external payable {}

    function withdraw(uint _amount) external {
        require(msg.sender == ongAccount, "caller is not owner");
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
