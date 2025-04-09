// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.28 < 0.8.30;

/// @title Polling App
/// @author askorupskyy
/// @notice Polling app where a user can create polls and have others vote
/// @dev
contract PollingApp {
    struct Poll {
        // id of the poll
        uint id;
        string title;
        // list of options, max size uint8
        string[] options;

        mapping(address => uint) votes;
        // count the number of results to save on gas and compute times
        mapping(uint => uint) results;

        address author;
        bool active;
    }

    uint public nextPollId;
    mapping (uint => Poll) public polls;

    function createPoll(string memory title, string[] memory options) external {
        require(options.length >= 2, "At least 2 options are required to make a poll");

        Poll storage p = polls[nextPollId];
        p.id = nextPollId;
        p.title = title;
        p.options = options;
        p.author = msg.sender;

        nextPollId++;
    }

    function vote(uint pollId, uint8 optionId) external {
        Poll storage p = polls[pollId];
        // in solidity, when we try to retrieve a `mapping`, it defaults to the default state of such mapping = { id: 0, title: "", ... }
        require(p.id == pollId, "Invalid pollId, such poll does not exist");
        require(p.options.length > optionId, "Invalid optionId, such options does not exist");

        p.votes[msg.sender] = optionId;
        ++p.results[optionId];
    }

    function getResults(uint pollId) external view returns (uint[] memory) {
        Poll storage p = polls[pollId];
        require(p.id == pollId, "Invalid pollId, such poll does not exist");

        // create a uint256 array, with the length of uint8 (max num of options);
        uint[] memory res = new uint[](p.options.length);
        for (uint i = 0; i < res.length; i++) {
            res[i] = p.results[i];
        }
        return res;
    }
}
