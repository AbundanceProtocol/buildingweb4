// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Data.sol";

contract Posts is Data {

    using Counters for Counters.Counter;
    Counters.Counter internal _postIds;

    function createPost(string memory _title, string memory _hash, PostAuthors[] memory _authors) public {
        // require(_percent < 100000);
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = _title;
        post.contentHash = _hash;
        post.initialReview = false;
        post.challenged = false;
        post.reqExpertise = 0;
        post.lockExpiration = block.timestamp;
        post.CrS = 0;
        post.IS = 0;
        post.postValue = 0;
        post.timestamp = block.timestamp;
        for (uint i = 0; i < _authors.length; i++) {
            post.postAuth.push(_authors[i]);
        }
        idToPost[postId] = post;
        hashToPost[_hash] = post;
        emit PostCreated(postId, _title, _hash);
    }

    function fetchPost(string memory _hash) public view returns(Post memory) {
        return hashToPost[_hash];
    }

    function fetchPostTitle(string memory _hash) public view returns(string memory) {
        return hashToPost[_hash].title;
    }
 
    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postIds.current();
        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Post storage currentItem = idToPost[currentId];
            posts[i] = currentItem;
        }
        return posts;
    }
}