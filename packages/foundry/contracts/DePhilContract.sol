// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IPublication {
    function mint(address account, uint256 id, uint256 amount, bytes memory data) external;
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) external;
}

contract DePhilContract is Ownable {
    address public publicationContractAddress;
    uint256 public nextPublicationId;

    struct Comment {
        uint256 id;
        address author;
        string content;
        uint256 createdAt;
    }

    struct Publication {
        string uri;
        uint256 id;
        string title;
        string summary;
        address author;
        uint256 cost;
        uint256 upVotes;
        int256 downVotes;
        uint256 commentsCount;
        string tags;
        uint256 createdAt;
        uint256 quantity;
    }

    struct Profile {
        string bio;
        string username;
        address payable owner;
        mapping(address => bool) following;
        mapping(address => bool) followers;
        mapping(uint256 => Publication) publications;
    }

    mapping(uint256 => mapping(uint256 => Comment)) public comments;
    mapping(uint256 => Publication) public publications;
    mapping(address => uint256) public userPoints;
    mapping(address => Profile) private profiles;

    constructor(address _owner, address _publicationContractAddress) Ownable(_owner) {
        publicationContractAddress = _publicationContractAddress;
        transferOwnership(_owner);
    }

    event PublicationCreated(uint256 indexed id, string title, address indexed author, uint256 quantity);
    event PublicationUpdated(uint256 indexed id, string title, address indexed author);
    event PublicationVoted(uint256 indexed id, address indexed voter, string typeofvote);

    modifier onlyAuthor(uint256 publicationId) {
        require(publications[publicationId].author == msg.sender, "Only the author can perform this action");
        _;
    }

    modifier notZeroAddress(address _address) {
        require(_address != address(0), "Invalid Address: address cannot be 0x0");
        _;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }

    receive() external payable {}

    function follow(address _address) public notZeroAddress(msg.sender) notZeroAddress(_address) {
        profiles[msg.sender].following[_address] = true;
        profiles[_address].followers[msg.sender] = true;
    }

    function unfollow(address _address) public notZeroAddress(msg.sender) notZeroAddress(_address) {
        profiles[msg.sender].following[_address] = false;
        profiles[_address].followers[msg.sender] = false;
    }

    function createPublication(
        string memory uri,
        string memory title,
        string memory summary,
        uint256 cost,
        string memory tags,
        uint256 quantity
    ) external {
        uint256 newPublicationId = nextPublicationId++;
        Publication memory newPublication = Publication({
            id: newPublicationId,
            title: title,
            summary: summary,
            author: msg.sender,
            cost: cost,
            upVotes: 0,
            downVotes: 0,
            commentsCount: 0,
            tags: tags,
            uri: uri,
            quantity: quantity,
            createdAt: block.timestamp
        });

        publications[newPublicationId] = newPublication;
        IPublication(publicationContractAddress).mint(msg.sender, newPublicationId, quantity, "");

        emit PublicationCreated(newPublicationId, title, msg.sender, quantity);
    }

    function updatePublication(
        uint256 publicationId,
        string memory uri,
        string memory title,
        string memory summary,
        uint256 cost,
        string memory tags
    ) external onlyAuthor(publicationId) {
        Publication storage publication = publications[publicationId];
        publication.uri = uri;
        publication.title = title;
        publication.summary = summary;
        publication.cost = cost;
        publication.tags = tags;

        emit PublicationUpdated(publicationId, title, msg.sender);
    }

    function getPublication(uint256 publicationId) external view returns (Publication memory) {
        return publications[publicationId];
    }

    function upvotePublication(uint256 publicationId) external {
        publications[publicationId].upVotes += 1;
        emit PublicationVoted(publicationId, msg.sender, "upvote");
    }

    function downvotePublication(uint256 publicationId) external {
        require(publications[publicationId].downVotes > 0, "Down vote cannot be positive");
        publications[publicationId].downVotes -= 1;
        emit PublicationVoted(publicationId, msg.sender, "downvote");
    }

    function addComment(uint256 publicationId, string memory content) external {
        Publication storage pub = publications[publicationId];
        uint256 newCommentId = pub.commentsCount++;
        comments[publicationId][newCommentId] = Comment({
            id: newCommentId,
            author: msg.sender,
            content: content,
            createdAt: block.timestamp
        });
    }

    function getComments(uint256 publicationId)
        public
        view
        returns (
            address[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        uint256 commentsCount = publications[publicationId].commentsCount;
        address[] memory authors = new address[](commentsCount);
        string[] memory contents = new string[](commentsCount);
        uint256[] memory createdAts = new uint256[](commentsCount);

        for (uint256 i = 0; i < commentsCount; i++) {
            Comment storage comment = comments[publicationId][i];
            authors[i] = comment.author;
            contents[i] = comment.content;
            createdAts[i] = comment.createdAt;
        }

        return (authors, contents, createdAts);
    }

    function getProfile(address _address) public view returns (string memory, string memory, address) {
        Profile storage profile = profiles[_address];
        return (profile.bio, profile.username, profile.owner);
    }

    function addProfile(string memory _bio, string memory _username) public {
        Profile storage profile = profiles[msg.sender];
        profile.bio = _bio;
        profile.username = _username;
        profile.owner = payable(msg.sender);
    }
}
