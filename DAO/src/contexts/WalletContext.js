import PropTypes from 'prop-types';
import { useEffect, createContext, useCallback, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';

import { useWeb3Auth } from '../hooks/useWeb3Auth';

// ----------------------------------------------------------------------
const noOp = () => {};
const WalletContext = createContext();

// ----------------------------------------------------------------------

// WalletContextProvider.propTypes = {
//   children: PropTypes.node,
// };

function WalletContextProvider({ children }) {
  const { connectMetamask, logOut } = useWeb3Auth();
  const { library, account } = useWeb3React();

  const slicedWalletAddress = useMemo(
    () => account && `${account?.slice(0, 10)}...${account?.slice(account?.length - 10, account?.length)}`,
    [account]
  );

  const connectWallet = useCallback(
    async ({ onSuccess = noOp, onError = noOp } = {}) => {
      try {
        await connectMetamask();
        return onSuccess();
      } catch (err) {
        onError();
      }
    },
    [connectMetamask]
  );

  const logout = useCallback((e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace('/');
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connectMetamask,
        connectWallet,
        logOut,
        account,
        slicedWalletAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export { WalletContextProvider, WalletContext };
