//SPDX-License-Identifier:MIT

pragma solidity 0.8.10;
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Voter is Ownable{
    using Counters for Counters.Counter;

    Counters.Counter private voters;

    Counters.Counter private approvedVoters;

    struct voter{
        string name;
        address wallet_address;
        bool isApproved;
        uint256 voterId;
    }


    mapping(address=>voter) public votersInfo;

    mapping(address =>bool) public isVoter;
    mapping(address =>bool) public isUser;
    mapping(address =>bool) public isAdmin;

    modifier onlyOwnerorAdmin(){
        require(isAdmin[msg.sender] || msg.sender == owner(), "Unauthorized");
        _;
    }


    event VoterAdded(address indexed _account, address indexed addedBy);
    event VoterApproved(address indexed _account, address indexed approvedBy);

    function user(address addr) public view returns(int success){
        if(isAdmin[addr]){
            return 0;
        }
        else if(isVoter[addr]){
            return 1;
        }
        else if(isUser[addr]){
            return 2;
        }
        else{
            return 0;
        }
    }

    function registerUser(address addr) public{
        isUser[addr] = true;
    }

    function addVoter(string memory name,address _address) public{
        voters.increment();
        voter storage _voterInfo = votersInfo[_address];
        _voterInfo.name = name;
        _voterInfo.wallet_address = _address;
        _voterInfo.voterId = voters.current();
        isVoter[_address] = true;
        emit VoterAdded(_address, msg.sender);

    }

    function approveVoter(address _account) public onlyOwnerorAdmin(){
        voter storage _voterInfo = votersInfo[_account];
        _voterInfo.isApproved = true;
        approvedVoters.increment();
        emit VoterApproved(_account, msg.sender);

    }

    function getVoterInfo(address _account) public view returns(voter memory voterInfo){
        return (votersInfo[_account]);

    }
    function checkVoterRole(address _account) public view returns(bool){
        return votersInfo[_account].isApproved;
    }

    function getApprovedVoter() public view returns(uint256){
        return approvedVoters.current();
    }

    function addAdmin(address _account) public onlyOwner(){
        isAdmin[_account] = true;
    }

}