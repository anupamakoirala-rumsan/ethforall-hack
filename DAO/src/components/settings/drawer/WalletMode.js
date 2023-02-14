import { useContext } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';

import { Grid, RadioGroup, CardActionArea, Button } from '@mui/material';

// hooks
import useSettings from '../../../hooks/useSettings';
//
import Iconify from '../../Iconify';
import BoxMask from './BoxMask';

import { WalletContext } from '../../../contexts/WalletContext';

// ----------------------------------------------------------------------

const BoxStyle = styled(CardActionArea)(({ theme }) => ({
  height: 72,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.disabled,
  border: `solid 1px ${theme.palette.grey[500_12]}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
}));

// ----------------------------------------------------------------------

export default function WalletMode() {
  const { themeMode, onChangeMode } = useSettings();
  const { connectWallet, account, slicedWalletAddress, logOut } = useContext(WalletContext);

  const handleWalletConnect = async (e) => {
    e.preventDefault();
    try {
      await connectWallet({
        onSuccess: () => {
          console.log('Wallet login success');
        },
        onError: () => {
          console.log('Wallet login failed');
        },
      });
    } catch (err) {
      console.log('Something went wrong');
    }
  };

  // const handleWalletConnect = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await connectWallet({
  //       onSuccess: () => {
  //         console.log('Wallet login success');
  //       },
  //       onError: () => {
  //         console.log('Wallet login failed');
  //       },
  //     });
  //   } catch (err) {
  //     console.log('Something went wrong');
  //   }
  // };

  return (
    <RadioGroup name="themeMode">
      <Grid dir="ltr" container spacing={2.5}>
        <Grid item xs={12}>
          <BoxStyle
            sx={{
              bgcolor: 'grey.800',
              ...{
                color: 'primary.main',
                boxShadow: (theme) => theme.customShadows.z20,
              },
            }}
          >
            {!account && <Iconify icon="logos:metamask-icon" width={48} height={48} />}
            {account && slicedWalletAddress}
            <BoxMask />
          </BoxStyle>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            size="large"
            variant="outlined"
            color={account ? 'error' : 'primary'}
            onClick={account ? logOut : handleWalletConnect}
            sx={{
              fontSize: 14,
              ...{
                bgcolor: (theme) =>
                  alpha(
                    account ? theme.palette.error.main : theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                  ),
              },
            }}
          >
            {account ? 'Disconnect' : 'Connect Wallet'}
          </Button>
        </Grid>
      </Grid>
    </RadioGroup>
  );
}
