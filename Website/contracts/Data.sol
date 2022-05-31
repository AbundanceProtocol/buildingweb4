//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Data {

    address public owner;
    uint public totalCategoryVotes;


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
    event FundingRequested(address user, ReqType reqType, uint reqId);
    event FundingBidPosted(address user, address funder, uint amount, uint percent);
    event BidsAccepted(address user, uint reqId, address[] funders);
    // event ReviewFundingRequest(address user, uint amount, uint percent, uint time);

    enum ReqType { Bid, Request, FundReview, FundChallenge }
    enum Urgency { Emergency, Urgent, Expedited, Regular }

    struct PartialBid {
        address bidder;
        uint amount;
    }

    struct FundingReq {
        uint amountRequested;
        uint reqId;
        uint deadline;
        uint returnRate;
        ReqType reqType;
    }

    struct FundingBid {
        uint amountProvided;
        uint bidId;
        uint returnRate;
        bool accepted;
        address bidder;
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
        ParentCat[] parentCat;
        address[] subscribers;
        string[] tempRelatedCat;
        string name;
        string catId;
        uint catVotes;
        uint totalPostValue;
        uint id;
        uint timeCreated;
        uint blockTime;
    }

    struct ParentCat {
        string catId;
        address user;
        uint userWeight;
        uint userVote;
    } // parent category

    struct Post {
        address[] reviewsList;
        PostCategories[] postCat;
        PostInflueces[] postInf;
        PostAuthors[] postAuth;
        PostReview[] postReview;
        string title;
        string contentHash;
        string initReviewtHash;
        uint reqExpertise;
        uint lockExpiration;
        uint IS;
        uint postValue;
        uint timestamp;
        uint id;
        uint CrS;
        bool initialReview;
        bool challenged;
    }

    struct InitialReview {
        PostReviewInflueces[] reviewInfluence;
        PostReviewCategories[] reviewCat;
        PostReviewAuthors[] reviewAuthor;
        Urgency urgency;
        address validator;
        string reviewHash;
        uint validatorTotalWeight;
        uint validatorCatWeight;
        uint selfIS;
        uint selfScore;
        uint postScore;
        uint postIS;
        uint timestamp;
        uint selfCrS;
        uint postCrS;
        bool funding;
    }

    struct InitialReviewValidation {
        address validator;
        uint validatorTotalWeight;
        uint validatorCatWeight;
    }

    struct PostReview {
        PostReviewInflueces[] reviewInfluence;
        PostReviewCategories[] reviewCat;
        PostReviewAuthors[] reviewAuthor;
        address reviewer;
        string reviewHash;
        uint reviewerTotalWeight;
        uint reviewerCatWeight;
        bool accepted;
        uint expectedReviewPercent;
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
