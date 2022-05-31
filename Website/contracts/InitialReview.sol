// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Data.sol";

contract InitialReview is Data {

    using Counters for Counters.Counter;
    Counters.Counter internal _initReviewIds;

    function createInitialReview(
        string memory _postHash, 
        string memory _reviewHash, 
        uint _validatorTotalWeight, 
        uint _validatorCatWeight, 
        uint _timestamp,
        // Urgency _urgency,
        // bool funding,
        // uint _selfCrS,
        // uint _selfIS,
        // uint _postCrS,
        // uint _postIS,
        PostReviewInflueces[] memory _reviewInfluence,
        PostReviewCategories[] memory _reviewCat,
        PostReviewAuthors[] memory _reviewAuthor
    ) public {
        require (_timestamp + 300 > block.timestamp);
        Post storage reviewPost = hashToPost[_postHash];
        require(!reviewPost.initialReview);
        _initReviewIds.increment();
        uint initReviewIds = _initReviewIds.current();
        reviewPost.initialReview = true;
        reviewPost.initReviewtHash = _reviewHash;
        InitialReview storage initReview = idToInitReview[initReviewIds];
        initReview.validator = msg.sender;
        initReview.reviewHash = _reviewHash;
        initReview.validatorTotalWeight = _validatorTotalWeight;
        initReview.validatorCatWeight = _validatorCatWeight;
        initReview.timestamp = _timestamp;
        for (uint i = 0; i < _reviewInfluence.length; i++) {
            initReview.reviewInfluence.push(_reviewInfluence[i]);
        }
        for (uint i = 0; i < _reviewCat.length; i++) {
            initReview.reviewCat.push(_reviewCat[i]);
        }
        for (uint i = 0; i < _reviewAuthor.length; i++) {
            initReview.reviewAuthor.push(_reviewAuthor[i]);
        }

        idToInitReview[initReviewIds] = initReview;
        hashInitReview[_reviewHash] = initReview;
        idToPost[reviewPost.id] = reviewPost;
        hashToPost[_postHash] = reviewPost;
        emit InitReviewCreated(initReviewIds, _postHash, _reviewHash);
    }

    function fetchInitReviewByPoat(string memory _hash) public view returns(InitialReview memory) {
        string memory reviewHash = hashToPost[_hash].initReviewtHash;
        return hashInitReview[reviewHash];
    }

    // function fetchInitReview(string memory _hash) public view returns(InitialReview memory) {
    //     return hashInitReview[_hash];
    // }

}