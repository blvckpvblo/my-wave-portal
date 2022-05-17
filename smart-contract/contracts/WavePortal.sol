// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint256) public addresses;

    constructor() {
        console.log("WavePortal constructor called.");
    }

    function wave() public {
        totalWaves += 1;
        addresses[msg.sender] += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getSenderTotalWaves(address sender) public view returns (uint256) {
        uint256 waves = addresses[sender];
        console.log("%s has waved %d at you.", sender, waves);
        return waves;
    }
}