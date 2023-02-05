
pragma solidity 0.8.10;
import '@openzeppelin/contracts/utils/Counters.sol';


contract FCC{
    using Counters for Counters.Counter;

    Counters.Counter private proposalId;

    struct proposal{
        string name;
        string description;
        uint256 funding;
        uint256 proposalId;
        uint256 votes;
    }

    mapping(uint256=>proposal) public proposalInfo;

    event ProposalAdded(address indexed _owner, uint256 indexed _proposalId, uint256 funds);
	event ProposalVoted(address indexed _voter, uint256 indexed _proposalId);

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

    function voteProposal(uint256 _proposalid) external {
		proposal storage _proposalInfo = proposalInfo[_proposalid];
		_proposalInfo.votes = ++_proposalInfo.votes;
		emit ProposalVoted(msg.sender, _proposalid);
	}

	function getProposalInfo(uint256 _proposalid) public view returns (proposal memory proposalinfo) {
		return (proposalInfo[_proposalid]);
	}
}
