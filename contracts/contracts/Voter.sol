//SPDX-License-Identifier:MIT

pragma solidity 0.8.10;
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Voter is Ownable{
    using Counters for Counters.Counter;

    Counters.Counter private voters;

    struct voter{
        string name;
        address wallet_address;
        bool isApproved;
        uint256 voterId;
    }
    mapping(address=>voter) public votersInfo;

    function addVoter(string memory name,address _address) public{
        voters.increment();
        voter storage _voterInfo = votersInfo[_address];
        _voterInfo.name = name;
        _voterInfo.wallet_address = _address;
        _voterInfo.voterId = voters.current();

    }

    function approveVoter(address _account) public onlyOwner(){
        voter storage _voterInfo = votersInfo[_account];
        _voterInfo.isApproved = true;

    }

    function getVoterInfo(address _account) public view returns(voter memory voterInfo){
        return (votersInfo[_account]);

    }
}