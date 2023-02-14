// hooks for metamask connection
import { useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

export const useWeb3Auth = () => {
  const { activate, deactivate, account, chainId } = useWeb3React();
  const injected = new InjectedConnector();

  const connectMetamask = useCallback(async () => {
    try {
      await activate(injected);
      localStorage.setItem('auth', 'Metamask');
    } catch (e) {
      localStorage.removeItem('auth');
    }
  }, [activate]);

  const logOut = useCallback(() => {
    deactivate();
    localStorage.removeItem('auth');
  }, [deactivate]);

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('auth') === 'Metamask') {
        await connectMetamask();
      }
    })();
  }, [connectMetamask]);

  return { connectMetamask, logOut };
};
