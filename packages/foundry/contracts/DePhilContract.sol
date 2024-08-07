// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @author raa
 */

interface IPublication {
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external;
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
        uint256 id;
        string title;
        string summary;
        address author;
        address owner;
        uint256 cost;
        uint256 upVotes;
        uint256 downVotes;
        uint256 commentsCount;
        string[] tags;
        string uri;
        uint256 quantity;
        uint256 createdAt;
    }

    struct Profile {
        string bio;
        string username;
        address payable owner;
        address[] following;
        address[] followers;
        Publication[] publications;
        Publication[] minted;
        uint256[] publicationIds;
    }

    mapping(uint256 => mapping(uint256 => Comment)) internal comments;
    mapping(uint256 => Publication) internal publications;
    mapping(address => uint256) public userPoints;
    mapping(address => Profile) private profiles;

    constructor(
        address _owner,
        address _publicationContractAddress
    ) Ownable(_owner) {
        publicationContractAddress = _publicationContractAddress;
        transferOwnership(_owner);
    }

    event PublicationCreated(
        uint256 indexed id,
        string title,
        address indexed author,
        uint256 quantity
    );
    event PublicationCommented(
        uint256 indexed id,
        address indexed commentAuthor,
        string content
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
    event PublicationBought(
        uint256 publicationId,
        address indexed buyer,
        address indexed seller,
        uint256 cost
    );


    modifier onlyAuthor(uint256 publicationId) {
        require(
            publications[publicationId].author == msg.sender,
            "Only the author can perform this action"
        );
        _;
    }

    modifier notZeroAddress(address _address) {
        require(
            _address != address(0),
            "Invalid Address: address cannot be 0x0"
        );
        _;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }

    receive() external payable {}

    function follow(
        address _address
    ) public notZeroAddress(msg.sender) notZeroAddress(_address) {
        Profile storage senderProfile = profiles[msg.sender];
        Profile storage receiverProfile = profiles[_address];

        bool isFollowing = false;
        for (uint256 i = 0; i < senderProfile.following.length; i++) {
            if (senderProfile.following[i] == _address) {
                isFollowing = true;
                break;
            }
        }

        if (!isFollowing) {
            senderProfile.following.push(_address);
            receiverProfile.followers.push(msg.sender);
        }
    }

    function unfollow(
        address _address
    ) public notZeroAddress(msg.sender) notZeroAddress(_address) {
        Profile storage senderProfile = profiles[msg.sender];
        Profile storage receiverProfile = profiles[_address];

        for (uint256 i = 0; i < senderProfile.following.length; i++) {
            if (senderProfile.following[i] == _address) {
                senderProfile.following[i] = senderProfile.following[
                    senderProfile.following.length - 1
                ];
                senderProfile.following.pop();
                break;
            }
        }

        for (uint256 i = 0; i < receiverProfile.followers.length; i++) {
            if (receiverProfile.followers[i] == msg.sender) {
                receiverProfile.followers[i] = receiverProfile.followers[
                    receiverProfile.followers.length - 1
                ];
                receiverProfile.followers.pop();
                break;
            }
        }
    }

    function createPublication(
        string memory uri,
        string memory title,
        string memory summary,
        uint256 cost,
        string[] memory tags,
        uint256 quantity
    ) external {
        uint256 newPublicationId = nextPublicationId++;
        Publication memory newPublication = Publication({
        id: newPublicationId,
        title: title,
        summary: summary,
        author: msg.sender,
        owner: msg.sender,
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
        profiles[msg.sender].publications.push(newPublication);
        profiles[msg.sender].publicationIds.push(newPublicationId);
        IPublication(publicationContractAddress).mint(
            msg.sender,
            newPublicationId,
            quantity,
            ""
        );

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
        Publication storage publication = publications[publicationId];
        
        if (bytes(uri).length > 0) {
            publication.uri = uri;
        }
        if (bytes(title).length > 0) {
            publication.title = title;
        }
        if (bytes(summary).length > 0) {
            publication.summary = summary;
        }
        if (cost > 0) {
            publication.cost = cost;
        }
        if (tags.length > 0) {
            publication.tags = tags;
        }

        emit PublicationUpdated(publicationId, title, msg.sender);
    }

    function getPublication(
        uint256 publicationId
    ) external view returns (Publication memory) {
        return publications[publicationId];
    }

    function upvotePublication(uint256 publicationId) external {
        publications[publicationId].upVotes += 1;
        userPoints[publications[publicationId].author] += 1;

        address publicationOwner = publications[publicationId].author;
        for (uint256 index = 0; index < profiles[publicationOwner].publications.length; index++) {
            if (profiles[publicationOwner].publications[index].id == publications[publicationId].id) {
                profiles[publicationOwner].publications[index].upVotes += 1;
                break;
            }
        }

        emit PublicationVoted(publicationId, msg.sender, "upvote");
    }

    function downvotePublication(uint256 publicationId) external {
        publications[publicationId].downVotes += 1;
        userPoints[publications[publicationId].author] += 1;

        address publicationOwner = publications[publicationId].author;
        for (uint256 index = 0; index < profiles[publicationOwner].publications.length; index++) {
            if (profiles[publicationOwner].publications[index].id == publications[publicationId].id) {
                profiles[publicationOwner].publications[index].downVotes += 1;
                break;
            }
        }

        emit PublicationVoted(publicationId, msg.sender, "downvote");
    }

    function addComment(uint256 publicationId, string memory content) external {
        Publication memory pub = publications[publicationId];
        pub.commentsCount++;
        uint256 newCommentId = pub.commentsCount;
        Comment memory newComment = Comment({
            id: newCommentId,
            author: msg.sender,
            content: content,
            createdAt: block.timestamp
        });
        comments[publicationId][newCommentId] = newComment;
        
        emit PublicationCommented(publicationId, msg.sender, content);
    }

    function getComments(
        uint256 publicationId
    )
        public
        view
        returns (address[] memory, string[] memory, uint256[] memory)
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

    function addProfile(string memory _bio, string memory _username) public {
        profiles[msg.sender].bio = _bio;
        profiles[msg.sender].username = _username;
        profiles[msg.sender].owner = payable(msg.sender);
    }

    function getProfile(
        address _address
    )
        public
        view
        returns (
            Profile memory
        )
    {
        return profiles[_address];
    }

    function buyPublication(uint256 publicationId) external payable {
        require(publicationId == publications[publicationId].id, "Publication does not exist");

        Publication storage publication = publications[publicationId];

        require(publication.cost > 0, "Publication is not for sale");
        require(msg.value >= publication.cost, "Insufficient funds sent");

        address payable author = payable(publication.author);

        author.transfer(publication.cost);

        publication.owner = msg.sender;

        emit PublicationBought(publicationId, msg.sender, author, publication.cost);
    }

    function buyMultiplePublications(uint256[] calldata publicationIds) external payable {
        uint256 totalCost = 0;

        for (uint256 i = 0; i < publicationIds.length; i++) {
            uint256 publicationId = publicationIds[i];
            require(publicationId == publications[publicationId].id, "Publication does not exist");

            Publication storage publication = publications[publicationId];
            require(publication.cost > 0, "Publication is not for sale");

            totalCost += publication.cost;
        }

        require(msg.value >= totalCost, "Insufficient funds sent");

        for (uint256 i = 0; i < publicationIds.length; i++) {
            uint256 publicationId = publicationIds[i];
            Publication storage publication = publications[publicationId];
            address payable author = payable(publication.author);

            author.transfer(publication.cost);

            publication.owner = msg.sender;

            emit PublicationBought(publicationId, msg.sender, author, publication.cost);
        }
    }

}
