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
    mapping(address => mapping(uint256 =>bool))  public isVoted;
    mapping(address => uint256 []) public proposedProposal;

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

    function addProposal(string memory name, string memory description, uint256 _funding) public{
        uint256 _id = proposalId.current();
        proposal storage proposalinfo = proposalInfo[_id];
        proposalinfo.name = name;
        proposalinfo.description = description;
        proposalinfo.funding = _funding;
        proposalinfo.proposalId = _id;
        proposalId.increment();
        proposedProposal[msg.sender].push(_id);
        emit ProposalAdded(msg.sender,_id,_funding);
    }

    function voteProposal(uint256 _proposalid,bool status) external  onlyVoter(){
        require(!acceptedProposal.contains(_proposalid), "FCC:Proposal already accepted");
        require(!rejectedProposal.contains(_proposalid), "FCC:Proposal already rejected");
        require(!isVoted[msg.sender][_proposalid], "FCC:Already voted");
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
        isVoted[msg.sender][_proposalid] = true;
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

    function getProposedProposal(address _account) public view returns(proposal [] memory){
        uint256 [] memory _proposedProposal = proposedProposal[_account];
        proposal [] memory _proposedProposalInfo = new proposal[](_proposedProposal.length);
        for(uint256 i = 0; i < _proposedProposal.length; i++){
            _proposedProposalInfo[i] = proposalInfo[_proposedProposal[i]];
        }
        return _proposedProposalInfo;
    }

    function getTotalProposal() public view returns(uint256){
        return proposalId.current();
    }
}
