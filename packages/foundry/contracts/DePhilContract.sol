//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";
import "./PublicationContract.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @author raa
 */

interface IPublication {
    function createPublication(
        string memory _uri,
        string memory _title,
        string memory _description,
        uint256 _cost,
        string[] memory _tags,
        uint256 _quantity
    ) external;

    function updatePublication(
        uint256 _id,
        string memory _uri,
        string memory _title,
        string memory _description,
        uint256 _cost,
        string[] memory _tags
    ) external;

    function getPublication(uint256 _id) external view returns (PublicationContract.Publication memory);
    function upvotePublication(uint256 _id) external;
    function downvotePublication(uint256 _id) external;

    function addComment(
        uint256 _id,
        string memory _content
    ) external;

    function getComments(
        uint256 _id
    ) external view returns (
        address[] memory,
        string[] memory,
        uint256[] memory
    );
}

contract DePhilContract is Ownable {

    address public contractOwner;

    IPublication publicationManagement;
    
    constructor(
        address _owner,
        address _publicationContractAddress
    ) Ownable(_owner)
    {
        publicationManagement = IPublication(_publicationContractAddress);
        contractOwner = _owner;
    }

    struct Profile {
        string bio;
        string username;
        address payable owner;
        mapping(address => bool) following;
        mapping(address => bool) followers;
        mapping(uint256 => PublicationContract.Publication) publications;
    }

    mapping(address => uint256) public userPoints;
    mapping(address => Profile) private profiles;

    modifier notZeroAddress(address _address) {
        require(_address != address(0), "Invalid Address: address cannot be 0x0");
        _;
    }

    function withdraw() public onlyOwner {
        (bool success,) = contractOwner.call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }

    receive() external payable {}

    function follow(address _address)
        public notZeroAddress(msg.sender)
        notZeroAddress(_address)
    {
        profiles[msg.sender].following[_address] = true;
        profiles[_address].followers[msg.sender] = true;
    }

    function unfollow(address _address)
        public notZeroAddress(msg.sender)
        notZeroAddress(_address)
    {
        profiles[msg.sender].following[_address] = false;
        profiles[_address].followers[msg.sender] = false;
    }
    
    function createPublication(
        string memory _uri,
        string memory _title,
        string memory _description,
        uint256 _cost,
        string[] memory _tags,
        uint256 _quantity
    ) public {
        publicationManagement.createPublication(_uri, _title, _description, _cost, _tags, _quantity);
    }

    function updatePublication(
        uint256 _id,
        string memory _uri,
        string memory _title,
        string memory _description,
        uint256 _cost,
        string[] memory _tags
    ) public {
        publicationManagement.updatePublication(_id, _uri, _title, _description, _cost, _tags);
    }

    function getPublication(uint256 _id) public view returns (PublicationContract.Publication memory) {
        return publicationManagement.getPublication(_id);
    }

    function upvotePublication(uint256 _id) public {
        publicationManagement.upvotePublication(_id);
    }

    function downvotePublication(uint256 _id) public {
        publicationManagement.downvotePublication(_id);
    }

    function addComment(
        uint256 _id,
        string memory _content
    ) public {
        publicationManagement.addComment(_id, _content);
    }

    function getComments(
        uint256 _id
    ) public view returns (
        address[] memory,
        string[] memory,
        uint256[] memory
    ) {
        return publicationManagement.getComments(_id);
    }

    function getPublications(address _address) public view returns (PublicationContract.Publication[] memory) {
        return profiles[_address].publications.;
    }

    function getProfile(address _address) public view returns (Profile memory) {
        return profiles[_address];
    }

    function addProfile(string memory _bio, string memory _username) public {
        profiles[msg.sender].bio = _bio;
        profiles[msg.sender].username = _username;
        profiles[msg.sender].owner = payable(msg.sender);
    }
}
