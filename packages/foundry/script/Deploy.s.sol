//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/DePhilContract.sol";
import "../contracts/DePhilPublicationContract.sol";
import "./DeployHelpers.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }
        vm.startBroadcast(deployerPrivateKey);

        string memory uri = setupLocalhostEnvUri();

        DePhilPublicationContract publication =
            new DePhilPublicationContract(vm.addr(deployerPrivateKey), uri);
        console.logString(
            string.concat(
                "Publication deployed at: ", vm.toString(address(publication))
            )
        );

        DePhilContract dePhil =
            new DePhilContract(vm.addr(deployerPrivateKey), address(publication));
        console.logString(
            string.concat(
                "DePhil deployed at: ", vm.toString(address(dePhil))
            )
        );

        vm.stopBroadcast();

        /**
         * This function generates the file containing the contracts Abi definitions.
         * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
         * This function should be called last.
         */
        exportDeployments();
    }

    function test() public {}
}
