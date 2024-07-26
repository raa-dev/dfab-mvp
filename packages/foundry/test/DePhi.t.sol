// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/DePhilContract.sol";
import "../contracts/PublicationContract.sol";

contract DePhilTest is Test {
    DePhilContract public dePhil;
    PublicationContract public publication;

    function setUp() public {
        publication = new PublicationContract("uri", address(this));
        dePhil = new DePhilContract(vm.addr(1), address(publication));
    }

    function testCreatePublication() public {
        dePhil.createPublication("uri", "title", "description", 1, ["tag1", "tag2"], 1);
        PublicationContract.Publication memory p = publication.getPublication(0);
        assertEq(p.id, 0);
        assertEq(p.title, "title");
        assertEq(p.description, "description");
        assertEq(p.cost, 1);
        assertEq(p.tags.length, 2);
        assertEq(p.quantity, 1);
    }
}
