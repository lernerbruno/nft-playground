// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

contract Tijolo {
    string public name;
    string public symbol;
    uint public decimals;
    uint public totalSupply ;
    mapping (address => uint) public balanceOf;
    
    constructor() {
        totalSupply = 1000000000000000000000000; // 1 million * 10ˆ18 (decimals)
        name = 'Tijolo';
        symbol = 'TJL';
        decimals = 18;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) external returns (bool success) {
        address _from = msg.sender;
        require(balanceOf[_from] >= _value);
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    event Transfer(address indexed from, address indexed to, uint value);

}