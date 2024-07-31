// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/DePhilContract.sol";
import "../contracts/DePhilPublicationContract.sol";

contract DePhilTest is Test {
    DePhilContract public dePhil;
    DePhilPublicationContract public publication;

    function setUp() public {
        publication = new DePhilPublicationContract(address(this), "uri");
        dePhil = new DePhilContract(vm.addr(1), address(publication));
    }

    function testCreatePublication() public {
        dePhil.createPublication("uri", "title", "description", 1, "tag1", 1);

    }
}
