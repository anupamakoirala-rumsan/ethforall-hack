// @mui
import { Container, Box, Stack, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userCards } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { ProposalCard } from './ProposalCard';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

export default function Proposals() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Proposals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Proposals"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Proposals', href: PATH_DASHBOARD.proposals },
            { name: 'List' },
          ]}
          action={
            <Button
              size="large"
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.proposals.create}
              startIcon={<Iconify icon={'eva:flash-fill'} width={16} height={16} />}
            >
              Add Proposal
            </Button>
          }
        />

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {_userCards.map((user) => (
            <ProposalCard key={user.id} user={user} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}
