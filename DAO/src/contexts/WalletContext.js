import PropTypes from 'prop-types';
import { useEffect, createContext, useCallback, useMemo, useReducer } from 'react';
import { useWeb3React } from '@web3-react/core';

import { useWeb3Auth } from '../hooks/useWeb3Auth';

// ----------------------------------------------------------------------
const noOp = () => {};

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  account: null,
  myRole: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, account, myRole } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      account,
      myRole,
    };
  },
  WALLET_LOGIN: (state, action) => {
    const { account, myRole } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      account,
      myRole,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const WalletContext = createContext({
  ...initialState,
  method: 'wallet',
  connectWallet: () => Promise.resolve(),
});

WalletContextProvider.propTypes = {
  children: PropTypes.node,
};

function WalletContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { connectMetamask, logOut } = useWeb3Auth();
  const { library, account } = useWeb3React();

  useEffect(() => {
    const initialize = async () => {
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          account: null,
          myRole: null,
        },
      });
    };
    initialize();
  }, []);

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

  const logut = useCallback((e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace('/');
  }, []);

  const walletLogin = async (account) => {
    console.log({ account });
    const role = 'admin';
    const wallet = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    dispatch({
      type: 'WALLET_LOGIN',
      payload: {
        account: wallet,
        myRole: role,
      },
    });
  };

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connectMetamask,
        connectWallet,
        logOut,
        walletLogin,
        account,
        slicedWalletAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export { WalletContextProvider, WalletContext };
