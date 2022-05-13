// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Data.sol";

contract Categories is Data {

    using Counters for Counters.Counter;
    Counters.Counter internal _categoryIds;

    function createCategory(string memory _name, string memory _hash, uint _percent, string[] memory _related, uint _time, bool _subscribe) public {
        require(_percent < 100000);
        require (_time + 300 > block.timestamp);
        _categoryIds.increment();
        uint categoryId = _categoryIds.current();
        Category storage category = idToCategory[categoryId];
        category.id = categoryId;
        category.name = _name;
        category.catId = _hash;
        category.timeCreated = _time;
        category.blockTime = block.timestamp;
        for (uint i = 0; i < _related.length; i++) {
            category.tempRelatedCat.push(_related[i]);
        }
        if (_subscribe) {
            category.subscribers.push(msg.sender);
        }
        category.catVotes = _percent;
        idToCategory[categoryId] = category;
        hashToCategory[_hash] = category;
        emit CategoryCreated(categoryId, _name, _hash);
    }

    function fetchCategory(string memory _hash) public view returns(Category memory) {
        return hashToCategory[_hash];
    }

    function fetchCategoryName(string memory _hash) public view returns(string memory) {
        return hashToCategory[_hash].name;
    }
 
    function fetchCategories() public view returns (Category[] memory) {
        uint itemCount = _categoryIds.current();
        Category[] memory categories = new Category[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Category storage currentItem = idToCategory[currentId];
            categories[i] = currentItem;
        }
        return categories;
    }

}