// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PublicationContract is ERC1155, Ownable {

    uint256 public pubId;

    address contractOwner;
    Publication public publication;

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
        string[] tags;
        uint256 createdAt;
        uint256 quantity;
    }

    mapping(uint256 => mapping(uint256 => Comment)) public comments;
    mapping(uint256 => Publication) public publications;

    constructor(
        string memory _uri,
        address _address
    ) ERC1155(_uri) Ownable(_address) {
        contractOwner = _address;
        pubId = 0;
    }

    event PublicationCreated(
        uint256 indexed id,
        string title,
        address indexed author,
        uint256 quantity
    );

    event PublicationUpdated(
        uint256 indexed id,
        string title,
        address indexed author
    );
    
    event PublicationVoted(
        uint256 indexed id,
        address indexed voter,
        string typeofvote
    );
    
    modifier onlyAuthor(uint256 publicationId) {
        require(
            publications[publicationId].author == msg.sender,
            "Only the author can perform this action"
        );
        _;
    }

    function createPublication(
        string memory uri,
        string memory title,
        string memory summary,
        uint256 cost,
        string[] memory tags,
        uint256 quantity
    ) external {

        uint256 newPublicationId = pubId++;

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
        _mint(msg.sender, newPublicationId, quantity, "");

        emit PublicationCreated(newPublicationId, title, msg.sender, quantity);
    }

    function updatePublication(
        uint256 publicationId,
        string memory uri,
        string memory title,
        string memory summary,
        uint256 cost,
        string[] memory tags
    ) external onlyAuthor(publicationId) {
        publications[publicationId].uri = uri;
        publications[publicationId].title = title;
        publications[publicationId].summary = summary;
        publications[publicationId].cost = cost;
        publications[publicationId].tags = tags;

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
        require(publications[publicationId].downVotes < 0, "Down vote cannot be positive");
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

    function getComments(
            uint256 publicationId
        ) public view
        returns (
            address[] memory,
            string[] memory,
            uint256[] memory
        ) {
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
}
