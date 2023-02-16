import React, { createContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { getContract } from '../utils/contract';
import propsalAbi from '../constant/abi/FCC.json';
import { CONTRACT_ADDRESS } from "src/constant/contractAddress";

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

    const addProposal = async (payload) =>{
        const {name,description,amount} = payload;
     
        const proposal = getContract(library, propsalAbi.abi,CONTRACT_ADDRESS.proposal[chainId]);
        const Funding = await Web3.utils.toWei(amount, "ether");
        let tx = await proposal.methods.addProposal(name,description,Funding).send({from:account});
    }

    const proposedProposal = await proposal.methods.getTotalProposal().call();

        const {propsalId, vote} = payload;
        const proposal = getContract(library, propsalAbi.abi, CONTRACT_ADDRESS.proposal[chainId]);
        let tx = await proposal.methods.voteProposal(propsalId, vote).send({from:account});
    }

    const getProposedProposal = async () =>{
        const {user} = payload;
        const proposal = getContract(library, propsalAbi.abi,CONTRACT_ADDRESS.proposal[chainId]);

        const proposedProposal = await proposal.methods.getProposedProposal(user).call();
        return proposedProposal;
        }

    const getAllProposal = async () =>{
        const proposal = getContract(library, propsalAbi.abi, CONTRACT_ADDRESS.proposal[chainId]);

        const proposedProposal = await proposal.methods.getTotalProposal().call();

        const proposals = [];
        for(let i =0; i<proposedProposal; i++){
            const proposal = await proposal.methods.getProposalInfo(i).call();
            proposals.push(proposal);
        }
        return proposals;
    }

    return (
        <ProposalContext.Provider value={{
            initialState:initialState,
            addProposal,
            getProposedProposal,
            voteProposal,
            getAllProposal
            
            }}>
            {children}
        </ProposalContext.Provider>
    )
}