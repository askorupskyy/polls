// SPDX-License-Identifier: MIT
pragma solidity =0.8.28;

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
    // keep track of who votes and what exactly they chose
    mapping(address => uint) votes;
    mapping(address => bool) hasVoted;
    // count the number of results to save on gas and compute times
    mapping(uint => uint) results;
    address author;
    bool active;
    // state the expiry date so we can't vote after a certain datetime
    uint expiry;
  }

  uint public nextPollId;
  mapping(uint => Poll) public polls;

  function createPoll(
    string memory title,
    string[] memory options,
    uint expiry
  ) external {
    require(
      options.length >= 2,
      "At least 2 options are required to make a poll"
    );

    Poll storage p = polls[nextPollId];
    p.id = nextPollId;
    p.title = title;
    p.options = options;
    p.author = msg.sender;
    p.active = true;
    p.expiry = expiry;

    nextPollId++;
  }

  function vote(uint pollId, uint8 optionId) external {
    Poll storage p = polls[pollId];
    require(
      p.expiry <= block.timestamp,
      "Current poll has expired, you can only view the results"
    );
    // in solidity, when we try to retrieve a `mapping`, it defaults to the default state of such mapping = { id: 0, title: "", ... }
    require(p.id == pollId, "Invalid pollId, such poll does not exist");
    require(
      p.options.length > optionId,
      "Invalid optionId, such options does not exist"
    );

    require(!p.hasVoted[msg.sender], "The sender has already voted");

    p.votes[msg.sender] = optionId;
    p.hasVoted[msg.sender] = true;
    ++p.results[optionId];
  }

  function getPolls() external view returns (string[] memory) {
    string[] memory res = new string[](nextPollId);
    for (uint i = 0; i < res.length; i++) {
      res[i] = polls[i].title;
    }
    return res;
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

  function getOptions(uint pollId) public view returns (string[] memory) {
    return polls[pollId].options;
  }

  function updatePoll(uint pollId, bool active) public {
    Poll storage p = polls[pollId];
    p.active = active;
  }
}
