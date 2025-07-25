import { useGetOrgsQuery } from '@/rtk-query/organization';
import React, { useState, useContext } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid2,
  MenuItem,
  styled,
  TextField,
  Typography,
  Select,
  useTheme,
  WorkspaceIcon,
  CircularProgress,
  CustomTooltip,
  useMediaQuery,
} from '@sistent/sistent';
import { NoSsr } from '@sistent/sistent';
import { useRouter } from 'next/router';
import OrgOutlinedIcon from '@/assets/icons/OrgOutlinedIcon';
import { iconLarge, iconXLarge } from 'css/icons.styles';
import { useDynamicComponent } from '@/utils/context/dynamicContext';
import _ from 'lodash';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import { useSelector } from 'react-redux';
import {
  useGetSelectedOrganization,
  useUpdateSelectedOrganizationMutation,
} from '@/rtk-query/user';
import { MobileOrgWksSwither } from './MobileViewSwitcher';
import WorkspaceModal from './WorkspaceModal';
import { WorkspaceModalContext } from '@/utils/context/WorkspaceModalContextProvider';

export const SlideInMenu = styled('div')(() => ({
  width: 0,
  overflow: 'hidden',
  transition: 'width 2s ease-in' /* Set transition properties */,
}));

export const SlideInMenuOpen = styled('div')(() => ({
  width: `${(props) => (props.open ? 'auto' : '0')}`,
  overflow: 'visible',
  transition: ' width 1s ease',
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  textAlign: 'center',
  fill: theme.palette.text.default,
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: 'transparent',
  '& .OrgClass': {
    display: 'none',
  },
  '& svg': {
    fill: '#eee',
  },

  [theme.breakpoints.down('md')]: {
    '& .MuiInputBase-input, & span': {
      minWidth: '8rem',
      maxWidth: '8rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },

  '@media (max-width: 400px)': {
    '& .MuiInputBase-input,': {
      maxWidth: 'unset',
      minWidth: 'unset',
      width: '100%',
    },

    '& span': {
      minWidth: '8rem',
      maxWidth: '10rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '40%',
  display: 'flex',
  marginBottom: '1.125rem', // 18px converted to rem
  marginRight: '0.625rem', // 10px converted to rem
  marginTop: '0.5rem', // 8px converted to rem
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.mode === 'dark' ? '#00B39F' : theme.palette.text.default, // change the color here
  },
}));

export const StyledHeader = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  fontSize: '1.65rem',

  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
    maxWidth: '7rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  color: theme.palette.common.white,
}));
export const StyledBetaHeader = styled('sup')(() => ({
  color: '#EEEEEE',
  fontWeight: '300',
  fontSize: '0.8125rem',
}));

const StyledSwitcher = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.5rem',
  userSelect: 'none',
  transition: 'width 2s ease-in',
  color: theme.palette.common.white,
  gap: '0.5rem 0rem',
}));

export function OrgMenu(props) {
  const { data: orgsResponse, isSuccess: isOrgsSuccess } = useGetOrgsQuery({});
  let orgs = orgsResponse?.organizations || [];
  let uniqueOrgs = _.uniqBy(orgs, 'id');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery('(max-width:400px)');
  const { selectedOrganization } = useGetSelectedOrganization();

  const [updateSelectedOrg, { isLoading: isUpdatingOrg }] = useUpdateSelectedOrganizationMutation();

  if (isUpdatingOrg) {
    return <CircularProgress size={24} style={{ color: theme.palette.background.brand.default }} />;
  }

  if (!selectedOrganization) return null;

  const organization = selectedOrganization;
  const { open, fromMobileView } = props;

  console.log('selectedOrganization', organization);

  const handleOrgSelect = (e) => {
    const id = e.target.value;
    updateSelectedOrg(id);
  };

  return (
    <NoSsr>
      {isOrgsSuccess && orgs && open && (
        <Grid2
          sx={{
            width: isSmallScreen ? '80%' : open ? 'auto' : 0,
            overflow: open ? '' : 'hidden',
            transition: 'all 1s',
          }}
        >
          <FormControl
            sx={{
              width: isSmallScreen ? '100%' : 'auto',
            }}
            component="fieldset"
          >
            <FormGroup>
              <FormControlLabel
                key="OrgPreferences"
                control={
                  <Grid2 container spacing={1} alignItems="flex-end" size="grow">
                    <Grid2 data-cy="mesh-adapter-url" size={{ xs: 12 }}>
                      <StyledSelect
                        value={organization.id}
                        onChange={handleOrgSelect}
                        SelectDisplayProps={{
                          style: {
                            display: 'flex',
                            flexDirection: 'row',
                            fill: '#eee',
                            paddingBlock: '9px 8px',
                            paddingInline: '18px 34px',
                            color: fromMobileView
                              ? theme.palette.text.default
                              : theme.palette.background.constant.white,
                          },
                        }}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                          },
                          getContentAnchorEl: null,
                          style: {
                            fill: theme.palette.text.secondary,
                          },
                        }}
                      >
                        {uniqueOrgs?.map((org) => (
                          <StyledMenuItem key={org.id} value={org.id}>
                            <OrgOutlinedIcon
                              width="24"
                              height="24"
                              className="OrgClass"
                              style={{ marginRight: '1rem', color: theme.palette.icon.default }}
                            />
                            <span>{org.name}</span>
                          </StyledMenuItem>
                        ))}
                      </StyledSelect>
                    </Grid2>
                  </Grid2>
                }
              />
            </FormGroup>
          </FormControl>
        </Grid2>
      )}
    </NoSsr>
  );
}

function DefaultHeader({ title, isBeta }) {
  return (
    <StyledHeader variant="h5" data-cy="headerPageTitle">
      {title}
      {isBeta ? <StyledBetaHeader>BETA</StyledBetaHeader> : ''}
    </StyledHeader>
  );
}

function OrganizationAndWorkSpaceSwitcher() {
  const [orgOpen, setOrgOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const { DynamicComponent } = useDynamicComponent();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { organization } = useSelector((state) => state.ui);
  const { isBeta } = useSelector((state) => state.ui.page);
  const { title } = useSelector((state) => state.ui.page);
  const { selectedOrganization } = useGetSelectedOrganization();

  //->using the wksp cntxt
  const { open: workspaceModal, closeModal: closeWorkspaceModal } =
    useContext(WorkspaceModalContext);

  if (!selectedOrganization) return null;

  return (
    <NoSsr>
      <StyledSwitcher>
        {isSmallScreen && (
          <>
            <MobileOrgWksSwither organization={organization} router={router} />/
          </>
        )}
        {!isSmallScreen && (
          <>
            <CustomTooltip title={'Organization'}>
              <div>
                <Button
                  onClick={() => {
                    setOrgOpen(!orgOpen);
                  }}
                  style={{ marginRight: orgOpen ? '1rem' : '0' }}
                >
                  <OrgOutlinedIcon {...iconXLarge} fill={theme.palette.common.white} />
                </Button>
              </div>
            </CustomTooltip>
            <OrgMenu open={orgOpen} organization={organization} />/
            <CustomTooltip title={'Workspaces'}>
              <div>
                <Button
                  onClick={() => {
                    setWorkspaceOpen(!workspaceOpen);
                  }}
                  style={{ marginRight: workspaceOpen ? '1rem' : '0' }}
                >
                  <WorkspaceIcon
                    {...iconLarge}
                    secondaryFill={theme.palette.common.white}
                    fill={theme.palette.common.white}
                  />
                </Button>
              </div>
            </CustomTooltip>
            <WorkspaceSwitcher open={workspaceOpen} organization={organization} router={router} />/
          </>
        )}
        <div id="meshery-dynamic-header" style={{ marginLeft: DynamicComponent ? '0' : '' }} />
        {!DynamicComponent && <DefaultHeader title={title} isBeta={isBeta} />}
        <WorkspaceModal workspaceModal={workspaceModal} closeWorkspaceModal={closeWorkspaceModal} />
      </StyledSwitcher>
    </NoSsr>
  );
}

export default OrganizationAndWorkSpaceSwitcher;
