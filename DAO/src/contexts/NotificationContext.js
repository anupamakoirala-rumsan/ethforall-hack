import PropTypes from 'prop-types';
import { useEffect, createContext, useCallback, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';

import { useWeb3Auth } from '../hooks/useWeb3Auth';

// ----------------------------------------------------------------------
const NotificationContext = createContext(null);

// ----------------------------------------------------------------------

// NotificationContextProvider.propTypes = {
//   children: PropTypes.node,
// };

function NotificationContextProvider({ children }) {
  const { account, library, chainId } = useWeb3React();

  const PK = 'e740b78333519828c5c88f0912ed5661ed0ee3e94f6d7ee69e181f51220484d0';
  const PKey = `0x${PK}`;
  const signer = new ethers.Wallet(PKey, library);

  const sendNotification = async ({ title, body, receiver }) => {
    try {
      const response = await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
          title,
          body,
        },
        payload: {
          title,
          body,
          cta: '',
          img: '',
        },
        recipients: `eip155:5:${receiver}`,
        channel: 'eip155:5:0x6C921E90396EFD1303033D1E69aB909fB1e81ca8',
        env: 'staging',
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return <NotificationContext.Provider value={{ sendNotification }}>{children}</NotificationContext.Provider>;
}

export { NotificationContextProvider, NotificationContext };
