export const getContract = (web3, abi, address) => {
    return new web3.eth.Contract(abi, address);
    };