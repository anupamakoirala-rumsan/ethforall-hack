import React, { createContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { getContract } from '../utils/contract';
import propsalAbi from '../constant/abi/FCC.json';

const initialState = {};

export const ProposalContext = createContext(null);

export const ProposalContextProvider = ({ children }) => {
  const { library, account, chainId } = useWeb3React();

  const addProposal = async (payload) => {
    const { name, description, amount } = payload;

    const proposal = getContract(library, propsalAbi.abi, '0x5FbDB2315678afecb367f032d93F642f64180aa3');
    const Funding = await Web3.utils.toWei(amount, 'ether');
    const tx = await proposal.methods.addProposal(name, description, Funding).send({ from: account });
  };

  const voteProposal = async (payload) => {
    const { propsalId, vote } = payload;
    const proposal = getContract(library, propsalAbi.abi, '0x5FbDB2315678afecb367f032d93F642f64180aa3');
    const tx = await proposal.methods.voteProposal(propsalId, vote).send({ from: account });
  };

  return (
    <ProposalContext.Provider
      value={{
        initialState: initialState,
        addProposal,
        voteProposal,
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
};
