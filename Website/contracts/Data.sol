//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Data {

    address public owner;
    uint256 public totalCategoryVotes;


    // mapping(string => mapping(string => uint)) public catRatio;
    // CatPost[] catPosts;
    mapping(address => mapping(string => CatPost[])) public catPost;
    mapping(address => string[]) public userCats;

    mapping(uint => Post) internal idToPost;
    mapping(string => Post) internal hashToPost;

    mapping(uint => Category) internal idToCategory;
    mapping(string => Category) internal hashToCategory;

    mapping(uint => InitialReview) internal idToInitReview;
    mapping(string => InitialReview) internal hashInitReview;

    mapping(uint => PostReview) internal idToPostReview;
    mapping(string => PostReview) internal hashPostReview;

    mapping(address => uint) public totalFundingReq;
    mapping(address => uint) public users;
    mapping(address => bool) public userAdded;
    address[] public keys;
    
    mapping(address => UserFunding[]) public userFunding;
    mapping(address => mapping(uint => FundingReq)) public fundingReq;
    mapping(address => FundingReq[]) public fundingReqs;

    mapping(address => mapping(uint => FundingBid[])) public fundingBids;
    mapping(address => mapping(uint => address[])) public fundingBidders;
    mapping(address => mapping(uint => address[])) public acceptedBidders;

    mapping(address => mapping(uint => mapping(address => FundingBid))) public fundingBid;

    mapping(address => mapping(uint => mapping(address => FundingBid))) public acceptedBid;
    // mapping(address => )

    event CategoryCreated(uint id, string name, string hash);
    event PostCreated(uint id, string title, string hash);
    event PostUpdated(uint id, string title, string hash, bool published);
    event InitReviewCreated(uint id, string postHash, string revHash);
    event FundingRequested(address user, uint amount, uint percent, uint deadline, ReqType reqType);
    event FundingBidPosted(address user, address funder, uint amount, uint percent);
    event BidsAccepted(address user, uint reqId, address[] funders);
    // event ReviewFundingRequest(address user, uint amount, uint percent, uint time);

    enum ReqType { Bid, FundReview, FundChallenge }
    enum Urgency { Emergency, Urgent, Expedited, Regular }

    struct PartialBid {
        address bidder;
        uint amount;
    }

    struct FundingReq {
        uint reqId;
        uint amountRequested;
        uint returnRate;
        ReqType reqType;
        uint deadline;
    }

    struct FundingBid {
        address bidder;
        uint bidId;
        uint amountProvided;
        uint returnRate;
        bool accepted;
    }

    struct UserFunding {
        address requestingFunds;
        address providingFunds;
        uint amountProvided;
        uint amountRemaining;
        uint returnRate;
        bool accepted;
        bool withdrawn;
    }

    struct Category {
        uint id;
        string name;
        string catId;
        uint catVotes;
        uint timeCreated;
        uint blockTime;
        string[] tempRelatedCat;
        address[] subscribers;
        ParentCat[] parentCat;
        uint totalPostValue;
    }

    struct ParentCat {
        string catId;
        address user;
        uint userWeight;
        uint userVote;
    } // parent category

    struct Post {
        uint id;
        string title;
        string contentHash;
        string initReviewtHash;
        PostCategories[] postCat;
        PostInflueces[] postInf;
        PostAuthors[] postAuth;
        PostReview[] postReview;
        bool initialReview;
        bool challenged;
        address[] reviewsList;
        uint reqExpertise;
        uint lockExpiration;
        uint CrS;
        uint IS;
        uint postValue;
        uint timestamp;
    }

    struct InitialReview {
        address validator;
        string reviewHash;
        uint validatorTotalWeight;
        uint validatorCatWeight;
        uint timestamp;
        Urgency urgency;
        bool funding;
        uint selfScore;
        uint selfCrS;
        uint selfIS;
        uint postScore;
        uint postCrS;
        uint postIS;
        PostReviewInflueces[] reviewInfluence;
        PostReviewCategories[] reviewCat;
        PostReviewAuthors[] reviewAuthor;
    }

    struct InitialReviewValidation {
        address validator;
        uint validatorTotalWeight;
        uint validatorCatWeight;
    }

    struct PostReview {
        address reviewer;
        string reviewHash;
        uint reviewerTotalWeight;
        uint reviewerCatWeight;
        bool accepted;
        uint expectedReviewPercent;
        PostReviewInflueces[] reviewInfluence;
        PostReviewCategories[] reviewCat;
        PostReviewAuthors[] reviewAuthor;
    }

    struct PostReviewInflueces {
        uint id;
        string contentHash;
        uint percentInfluence;
    }

    struct PostReviewAuthors {
        address author;
        uint authorWeight;
    }

    struct PostReviewCategories {
        string catId;
        uint impact;
    }

    struct PostInflueces {
        uint id;
        string contentHash;
        uint percentInfluence;
    }

    struct PostCategories {
        string catId;
        uint impact;
    }

    struct PostAuthors {
        address author;
        string authorName;
        uint authorWeight;
    }

    struct CatPost {
        string postHash;
        uint catImpact;
        uint postCred;
        uint timestamp;
    }

    struct PostCats {
        string catHash;
        uint catImpact;
    }

    PostCats[] postCats;
}
