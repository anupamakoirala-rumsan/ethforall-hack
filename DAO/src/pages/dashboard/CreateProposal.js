import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useContext } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container } from '@mui/system';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../components/hook-form';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ProposalContext } from '../../contexts/ProposalContext';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProposalsCreate.propTypes = {
  isEdit: PropTypes.bool,
  currentProposal: PropTypes.object,
};

export default function ProposalsCreate({ isEdit, currentProposal }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { addProposal } = useContext(ProposalContext);

  const NewProposalSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    amount: Yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProposal?.name || '',
      description: currentProposal?.description || '',
      amount: currentProposal?.amount || 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProposal]
  );

  const methods = useForm({
    resolver: yupResolver(NewProposalSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProposal) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProposal]);

  const onSubmit = async () => {
    try {
      console.log('here');
      await addProposal(values);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // navigate(PATH_DASHBOARD.proposals.root);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="User: Proposals">
      <Container>
        <HeaderBreadcrumbs
          heading="Proposals"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Proposals', href: PATH_DASHBOARD.proposals },
            { name: 'Create' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Proposal Title" />

                  <RHFTextField name="amount" label="Funding Amount" />

                  <div>
                    <LabelStyle>Description</LabelStyle>
                    <RHFEditor simple name="description" />
                  </div>
                  <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                    {!isEdit ? 'Create Proposal' : 'Save Changes'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Page>
  );
}
