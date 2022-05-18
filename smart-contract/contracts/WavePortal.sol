// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 private seed; // random number
    uint256 totalWaves;
    mapping(address => uint256) public addresses; // address book of the contract
    mapping(address => uint256) public lastWavedAt;
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // address of user who waved
        string message; // the message of the user
        uint256 timestamp; // the timestamp when the user waved
    }

    Wave[] waves; // array of the all waves

    constructor() payable {
        console.log("WavePortal CONSTRUCTOR CALLED.");

        seed = (block.difficulty + block.timestamp) % 100;
    }

    function wave(string memory _message) public {
        require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Wait 30s");

        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1; // increment totalWaves
        addresses[msg.sender] += 1; // add users to address book

        console.log("%s waved w/ message %s", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp)); // add message to array of waves

        seed = (block.difficulty + block.timestamp + seed) % 100; // generate random number
        console.log("Random # generated: %d", seed);

        if (seed <= 1) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract");
        }

        emit NewWave(msg.sender, block.timestamp, _message); // emit Wave
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
