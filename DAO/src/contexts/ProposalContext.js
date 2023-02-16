import React, { createContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { getContract } from '../utils/contract';
import propsalAbi from '../constant/abi/FCC.json';
import { CONTRACT_ADDRESS } from '../constant/contractAddress';

const initialState = {};

export const ProposalContext = createContext(null);

export const ProposalContextProvider = ({ children }) => {
  const { library, account, chainId } = useWeb3React();

  const addProposal = async (payload) => {
    const { name, description, amount } = payload;

    const proposal = getContract(library, propsalAbi.abi, CONTRACT_ADDRESS.proposal[chainId]);
    const Funding = await Web3.utils.toWei(amount, 'ether');
    const tx = await proposal.methods.addProposal(name, description, Funding).send({ from: account });
  };

  const voteProposal = async (payload) => {
    const { propsalId, vote } = payload;
    const proposal = getContract(library, propsalAbi.abi, CONTRACT_ADDRESS.proposal[chainId]);
    const tx = await proposal.methods.voteProposal(propsalId, vote).send({ from: account });
  };

  const getProposedProposal = async (payload) => {
    const { user } = payload;
    const proposal = getContract(library, propsalAbi.abi, CONTRACT_ADDRESS.proposal[chainId]);

    const proposedProposal = await proposal.methods.getProposedProposal(user).call();
    return proposedProposal;
  };

  const getAllProposal = async () => {
    const proposal = getContract(library, propsalAbi.abi, CONTRACT_ADDRESS.proposal[chainId]);

    const proposedProposal = await proposal.methods.getTotalProposal().call();

    const proposals = [];
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < proposedProposal; i = +1) {
      const proposal = await proposal.methods.getProposalInfo(i).call();
      proposals.push(proposal);
    }
    return proposals;
  };

  return (
    <ProposalContext.Provider
      value={{
        initialState,
        addProposal,
        getProposedProposal,
        voteProposal,
        getAllProposal,
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
};
