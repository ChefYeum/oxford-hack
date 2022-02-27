// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract Payable {
    event Deposit(uint amount);
    event Transfer(address addr, uint amount);

    // Payable address can receive Ether
    address payable public owner;

    // Payable constructor can receive Ether
    constructor() payable {
        owner = payable(msg.sender);
    }

    // Function to deposit Ether into this contract.
    // Call this function along with some Ether.
    // The balance of this contract will be automatically updated.
    // function deposit() public payable {}

    receive() external payable {
        emit Deposit(msg.value);
    }

    // Function to withdraw all Ether from this contract.
    // function withdraw() public {
    //     require(msg.sende == owner, "not owner");
    //     emit SendEth
    //     // get the amount of Ether stored in this contract
    //     uint amount = address(this).balance;

    //     // send all Ether to owner
    //     // Owner can receive Ether since the address of owner is payable
    //     (bool success, ) = owner.call{value: amount}("");
    //     require(success, "Failed to send Ether");
    // }

    // Function to transfer Ether from this contract to address from input
    // _amount is in ETH / 1e8
    function transfer(address payable _to, uint _amount) public {
        require(msg.sender == owner, "not owner");
        uint amount = _amount;
        // Note that "to" is declared as payable
        (bool success, ) = _to.call{value: amount}("");
        require(success, "Failed to send Ether");
        emit Transfer(_to, amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
