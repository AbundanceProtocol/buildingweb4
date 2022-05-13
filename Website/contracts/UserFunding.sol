// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Data.sol";

contract UserFunding is Data {

    using Counters for Counters.Counter;
    Counters.Counter internal _fundingReqId;

    function requestFunding(uint _amount, uint _percentReturn, uint _deadline, ReqType _reqType) public {
        _fundingReqId.increment();
        uint fundingReqId = _fundingReqId.current();
        FundingReq memory _fundingReq = FundingReq({
            reqId: fundingReqId,
            amountRequested: _amount,
            returnRate: _percentReturn,
            reqType: _reqType,
            deadline: _deadline
        });
        fundingReq[msg.sender][fundingReqId] = _fundingReq;
        fundingReqs[msg.sender].push(_fundingReq);
        totalFundingReq[msg.sender] += _amount;
        emit FundingRequested(msg.sender, _amount, _percentReturn, _deadline, _reqType);
    }

    function getFundingReq(address _user, uint _reqId) public view returns(FundingReq memory) {
        return fundingReq[_user][_reqId];
    }

    function getAllFundingReqs(address _user) public view returns(UserFunding[] memory) {
        return userFunding[_user];
    }

    function getAcceptedBids(address _user, uint _reqId) public view returns(address[] memory) {
        return acceptedBidders[_user][_reqId];
    }

    function getAcceptedBid(address _user, uint _reqId, address _bidder) public view returns(FundingBid memory) {
        return acceptedBid[_user][_reqId][_bidder];
    }

    function requestReviewFunding(uint _amount, uint _percent, ReqType _reqType) public {
        // add: string memory _reviewHash
        // need to address reviewHash issue
        _fundingReqId.increment();
        uint fundingReqId = _fundingReqId.current();
        FundingReq memory _fundingReq = FundingReq({
            reqId: fundingReqId,
            amountRequested: _amount,
            returnRate: _percent,
            reqType: _reqType,
            deadline: block.timestamp + 720
        });
        fundingReq[msg.sender][fundingReqId] = _fundingReq;
        fundingReqs[msg.sender].push(_fundingReq);

        emit FundingRequested(msg.sender, _amount, _percent, block.timestamp + 720, _reqType);
    }

    function bidFunding(address _user, uint _reqId, uint _amount, uint _percent) public {
        require(fundingReq[_user][_reqId].deadline > block.timestamp);
        require(fundingReq[_user][_reqId].returnRate <= _percent);
        _fundingReqId.increment();
        uint fundingBidId = _fundingReqId.current();
        fundingBid[_user][_reqId][msg.sender] = FundingBid({
            bidder: msg.sender,
            bidId: fundingBidId,
            amountProvided: _amount,
            returnRate: _percent,
            accepted: false
        });
        fundingBidders[_user][_reqId].push(msg.sender);
        emit FundingBidPosted(_user, msg.sender, _amount, _percent);
    }

    function cancelBid(address _user, uint _reqId, uint _bidId) public {
        delete fundingBid[_user][_reqId][msg.sender];
        for (uint i = 0; i < fundingBids[_user][_reqId].length; i++) {
            if (fundingBids[_user][_reqId][i].bidId == _bidId) {
                delete fundingBids[_user][_reqId][i];
            }
        }
    }

    function findBidder(address _user, uint _reqId, address _bidder) view public returns(FundingBid memory) {
        return fundingBid[_user][_reqId][_bidder];
    }

    function acceptBids(uint _reqId, address[] memory _addresses, PartialBid memory _partial) public  {
        require(fundingReq[msg.sender][_reqId].deadline < block.timestamp);

        require(acceptBidsFraudProof(msg.sender, _reqId, _addresses, _partial));

        for (uint i = 0; i < _addresses.length - 1; i++) {
            acceptedBidders[msg.sender][_reqId].push(_addresses[i]);
            acceptedBid[msg.sender][_reqId][_addresses[i]] = findBidder(msg.sender, _reqId, _addresses[i]);
        }
        acceptedBidders[msg.sender][_reqId].push(_addresses[_addresses.length - 1]);
        if (_partial.amount == 0) {
           acceptedBid[msg.sender][_reqId][_addresses[_addresses.length - 1]] = findBidder(msg.sender, _reqId, _addresses[_addresses.length - 1]);
        } else {
            FundingBid memory _fundingBid = findBidder(msg.sender, _reqId, _addresses[_addresses.length - 1]);
            _fundingBid.amountProvided = _partial.amount;
            acceptedBid[msg.sender][_reqId][_addresses[_addresses.length - 1]] = _fundingBid;
        }
        emit BidsAccepted(msg.sender, _reqId, _addresses);
    }

    function acceptBidsFraudProof(address _user, uint _reqId, address[] memory _addresses, PartialBid memory _partial) view public returns (bool) {
        bool noFraud = true;
        uint _amountRequested = fundingReq[_user][_reqId].amountRequested;
        uint _bidAmount = 0;
        for (uint i = 0; i < _addresses.length - 1; i++) {
            uint _bid = findBidder(_user, _reqId, _addresses[i]).amountProvided;
            _bidAmount += _bid;
        }
        if (_partial.amount == 0) {
            _bidAmount += findBidder(_user, _reqId, _addresses[_addresses.length - 1]).amountProvided;
        } else {
            _bidAmount += _partial.amount;
        }

        if (_amountRequested >= _bidAmount) {
            return noFraud;
        } else {
            return !noFraud;
        }
    }

    function calculateLowestBids(uint _reqId) view public returns(address[] memory, PartialBid memory) {
        uint _amountRequested = fundingReq[msg.sender][_reqId].amountRequested;
        uint totalBid = 0;
        FundingBid[] memory _fundingBids = fundingBids[msg.sender][_reqId];
        address[] memory acceptedBids = new address[](_fundingBids.length);
        uint _amountProvided;
        uint _returnRate = _fundingBids[0].returnRate;
        uint _index = 0;
        for (uint j = 0; j < _fundingBids.length; j++) {

            if (totalBid < _amountRequested) {
                for (uint i = 0; i < _fundingBids.length; i++) {
                    if (!_fundingBids[i].accepted && _fundingBids[i].returnRate <= _returnRate) {
                        _returnRate = _fundingBids[i].returnRate;
                        _index = i;
                    }
                }
                _amountProvided = _fundingBids[_index].amountProvided;
                _fundingBids[_index].accepted = true;
                acceptedBids[_index] = _fundingBids[_index].bidder;
                if (totalBid + _amountProvided > _amountRequested) {
                    uint _partial = _amountRequested - totalBid;
                    return (acceptedBids, PartialBid(acceptedBids[_index], _partial));
                } else {
                    totalBid += _fundingBids[_index].amountProvided;
                }
            }
        }
        return (acceptedBids, PartialBid(acceptedBids[_index], 0));
    }
}

