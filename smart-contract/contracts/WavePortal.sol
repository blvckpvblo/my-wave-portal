// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint256) public addresses;       // address book of the contract
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;      // address of user who waved
        string message;     // the message of the user
        uint256 timestamp;  // the timestamp when the user waved
    }

    Wave[] waves;       // array of the all waves

    constructor() payable {
        console.log("WavePortal CONSTRUCTOR CALLED.");
    }

    function wave(string memory _message) public {
        totalWaves += 1;                // increment totalWaves
        addresses[msg.sender] += 1;     // add users to address book

        console.log("%s waved w/ message %s", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));        // add message to array of waves

        emit NewWave(msg.sender, block.timestamp, _message);            // emit Wave

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract");
    }

    /**
     * Get all the waves stored by the contract
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getSenderTotalWaves(address sender) public view returns (uint256) {
        uint256 userWaves = addresses[sender];
        console.log("%s has waved %d at you.", sender, userWaves);
        return userWaves;
    }
}