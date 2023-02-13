//SPDX-License-Identifier:MIT


pragma solidity 0.8.10;
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import './Voter.sol';


contract FCC is Ownable{
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    EnumerableSet.UintSet private acceptedProposal;

    EnumerableSet.UintSet private rejectedProposal;


    Counters.Counter private proposalId;

    struct proposal{
        string name;
        string description;
        uint256 funding;
        uint256 proposalId;
        uint256 positiveVotes;
        uint256 negativeVotes;
    }


    mapping(uint256=>proposal) public proposalInfo;

    uint256 public VOTE_REQUIRED_FOR_APPROVAL;

    event ProposalAdded(address indexed _owner, uint256 indexed _proposalId, uint256 funds);
	event ProposalVoted(address indexed _voter, uint256 indexed _proposalId, bool status);
    event ProposalAccepted(address indexed _finalVoter,uint256 indexed _proposalId, uint256 funds);
    event ProposalRejected(address indexed _finalVoter,uint256 indexed _proposalId, uint256 funds);

    event ProposalMinVoteChanged(address indexed _changedBy, uint256 _newVoteRequired);
    Voter public voter;

    constructor(address _voterAddress){
        voter = Voter(_voterAddress);
        VOTE_REQUIRED_FOR_APPROVAL = 7000; //70%

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

    function voteProposal(uint256 _proposalid,bool status) external  onlyVoter(){
        require(!acceptedProposal.contains(_proposalid), "FCC:Proposal already accepted");
        require(!rejectedProposal.contains(_proposalid), "FCC:Proposal already rejected");
		proposal storage _proposalInfo = proposalInfo[_proposalid];
        if(status){
            _proposalInfo.positiveVotes = ++_proposalInfo.positiveVotes;
            uint256 totalVotes = calculateVoteper10000(VOTE_REQUIRED_FOR_APPROVAL);
        if(_proposalInfo.positiveVotes >= totalVotes){
            acceptedProposal.add(_proposalid);
            emit ProposalAccepted(msg.sender, _proposalid, _proposalInfo.funding);}
        }
        if(!status){
            _proposalInfo.negativeVotes = ++_proposalInfo.negativeVotes;
            uint256 totalVotes = calculateVoteper10000(10000-VOTE_REQUIRED_FOR_APPROVAL);

        if(_proposalInfo.negativeVotes >= totalVotes){
            rejectedProposal.add(_proposalid);
            emit ProposalRejected(msg.sender, _proposalid, _proposalInfo.funding);}
        }
		emit ProposalVoted(msg.sender, _proposalid,status);
	}

	function getProposalInfo(uint256 _proposalid) public view returns (proposal memory proposalinfo) {
		return (proposalInfo[_proposalid]);
	}

    function changeMinVoteRequired(uint256 _newVoteRequired) public onlyOwner(){
        VOTE_REQUIRED_FOR_APPROVAL = _newVoteRequired;
        emit ProposalMinVoteChanged(msg.sender, _newVoteRequired);
    }

    function calculateVoteper10000(uint256 _percentage) public view returns(uint256){
        uint256 totalVotes = voter.getApprovedVoter();
        uint256 voterequired = _percentage*totalVotes/10000;
        return voterequired;
    }
}
