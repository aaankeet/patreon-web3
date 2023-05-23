// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Web3Patreon.sol";
import "forge-std/console.sol";

contract Web3PatreonTest is Test {
    Web3Patreon public patreon;
    address public owner = makeAddr("owner");

    function setUp() public {
        vm.prank(owner);
        patreon = new Web3Patreon();
    }

    function testOwner() public {
        assertEq(patreon.owner(), owner);
    }

    function testRevert() public {
        vm.expectRevert();
        patreon.safeMint{value: 0.4 ether}(owner, "");
    }

    function testSafeMint() public {
        patreon.safeMint{value: 0.5 ether}(owner, "");
        assertEq(patreon.ownerOf(0), owner);
        assertEq(address(owner).balance, 0.5 ether);
    }
}
