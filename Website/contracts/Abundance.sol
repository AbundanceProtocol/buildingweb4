// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

// import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "./Data.sol";
import "./Categories.sol";
import "./Posts.sol";
import "./UserFunding.sol";
import "./UserScore.sol";
import "./InitialReview.sol";

contract Abundance is ERC20, Categories, Posts, InitialReview, UserFunding, UserScore {

    uint time;

    constructor(uint256 _supply) ERC20("Webcoin", "WEB") {
        _mint(msg.sender, _supply);
        time = block.timestamp + 50;
        emit Transfer(address(0), msg.sender, _supply);
    }

    function mint(address receiver, uint amount) public timeLock {
        _mint(receiver, amount);
        emit Transfer(address(0), receiver, amount);
    }

    function progress() public view timeLock returns(uint) {
        uint timestamp = block.timestamp;
        return timestamp;
    }

    function _timeLock() private view {
        require(block.timestamp > time, "Tokens locked");
    }

    modifier timeLock() {
        _timeLock();
        _;
    }

    function numReturn() public pure returns(uint) {
        return 42;
    }

}