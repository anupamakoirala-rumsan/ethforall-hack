import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Stack, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import cssStyles from '../../../utils/cssStyles';
import { fShortenNumber } from '../../../utils/formatNumber';
// components
import Image from '../../../components/Image';
import SocialsButton from '../../../components/SocialsButton';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

ProposalCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default function ProposalCard({ user }) {
  const { name, cover, position, follower, totalPost, avatarUrl, following } = user;

  return (
    <Card sx={{ textAlign: 'center' }}>
      {/* <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />
        <OverlayStyle />
        <Image src={cover} alt={cover} ratio="16/9" />
      </Box> */}

      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        {name}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {position}
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Typography variant="body2" align="justify" sx={{ color: 'text.secondary', p: 2 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque elit justo, vestibulum sed sodales non, rhoncus
        sed risus. Praesent eu auctor augue. Aliquam ante arcu, luctus in bibendum in, semper at risus. Ut malesuada
        facilisis nisl eu ultrices.
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ py: 3, px: 2, display: 'grid', gap: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div>
          <LoadingButton
            fullWidth
            size="large"
            variant="outlined"
            color="primary"
            // onClick={account ? logOut : handleWalletConnect}
            sx={{
              fontSize: 14,
              ...{
                bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
              },
            }}
          >
            Accept
          </LoadingButton>
        </div>

        <div>
          <LoadingButton
            fullWidth
            size="large"
            variant="outlined"
            color="error"
            // loading="true"
            // onClick={account ? logOut : handleWalletConnect}
            sx={{
              fontSize: 14,
              ...{
                bgcolor: (theme) => alpha(theme.palette.error.main, theme.palette.action.selectedOpacity),
              },
            }}
          >
            Reject
          </LoadingButton>
        </div>
      </Box>
    </Card>
  );
}
