//SPDX-License-Identifier:MIT


pragma solidity 0.8.10;
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import './Voter.sol';


contract FCC is Ownable{
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    EnumerableSet.UintSet private acceptedProposal;

    Counters.Counter private proposalId;

    struct proposal{
        string name;
        string description;
        uint256 funding;
        uint256 proposalId;
        uint256 votes;
    }


    mapping(uint256=>proposal) public proposalInfo;

    uint256 public VOTE_REQUIRED_FOR_APPROVAL;

    event ProposalAdded(address indexed _owner, uint256 indexed _proposalId, uint256 funds);
	event ProposalVoted(address indexed _voter, uint256 indexed _proposalId);
    event ProposalAccepted(address indexed _finalVoter,uint256 indexed _proposalId, uint256 funds);
    event ProposalMinVoteChanged(address indexed _changedBy, uint256 _newVoteRequired);
    Voter public voter;

    constructor(address _voterAddress){
        voter = Voter(_voterAddress);
        VOTE_REQUIRED_FOR_APPROVAL = 3;

    }

    modifier onlyVoter(){
        require(voter.checkVoterRole(msg.sender),"FCC:Unauthorized ");
        _;
    }

    function addProposal(proposal memory ProposalInfo) public{
        uint256 _id = proposalId.current();
        proposal storage proposalinfo = proposalInfo[_id];
        proposalinfo.name = ProposalInfo.name;
        proposalinfo.description = ProposalInfo.description;
        proposalinfo.funding = ProposalInfo.funding;
        proposalinfo.proposalId = _id;
        proposalId.increment();
        emit ProposalAdded(msg.sender,_id,ProposalInfo.funding);
    }

    function voteProposal(uint256 _proposalid) external  onlyVoter(){
        require(!acceptedProposal.contains(_proposalid), "FCC:Proposal already accepted");
		proposal storage _proposalInfo = proposalInfo[_proposalid];
		_proposalInfo.votes = ++_proposalInfo.votes;
        if(_proposalInfo.votes >= VOTE_REQUIRED_FOR_APPROVAL){
            acceptedProposal.add(_proposalid);
            emit ProposalAccepted(msg.sender, _proposalid, _proposalInfo.funding);
        }
		emit ProposalVoted(msg.sender, _proposalid);
	}

	function getProposalInfo(uint256 _proposalid) public view returns (proposal memory proposalinfo) {
		return (proposalInfo[_proposalid]);
	}

    function changeMinVoteRequired(uint256 _newVoteRequired) public onlyOwner(){
        VOTE_REQUIRED_FOR_APPROVAL = _newVoteRequired;
        emit ProposalMinVoteChanged(msg.sender, _newVoteRequired);
    }
}
