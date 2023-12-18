import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, IconButton, Toolbar, Typography, Container, Link, Collapse, styled } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { PropTypes } from 'prop-types';
import ArticleIcon from '@mui/icons-material/Article';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AppContext from '../../pages/AppContext';
import CompletenessErrorNavMenu from '../NavMenu/CompletenessErrorNavMenu';
import AdherenceErrorNavMenu from '../NavMenu/AdherenceErrorNavMenu';
import OverviewNavMenu from '../NavMenu/OverviewNavMenu';
import { hasCompletenessErrors, hasAdherenceErrors, isRepairCompleted } from '../../helpers/app-utils';
import { BLACK, GREEN, WHITE } from '../../constants/Color';
import { XLSX, TSV, CSV, TXT } from '../../constants/MimeType';

const LightTooltip = styled(({ className, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const NewButton = styled(IconButton)({
  color: WHITE,
  '&:hover': {
    color: BLACK,
    backgroundColor: WHITE,
  },
});

const Banner = styled(Box)({
  backgroundColor: GREEN,
  color: BLACK,
  padding: '16px',
  fontSize: '18px',
  textAlign: 'center',
});

const Navbar = ({ inputFileName }) => {
  const navigate = useNavigate();
  const [bannerhide, setBannerHide] = useState(true);
  const { appData, patches } = useContext(AppContext);
  const { reporting, otherProps } = appData;
  const { inputFileMetadata } = otherProps;
  const isInputSpreadsheetValid = reporting.length === 0;

  useEffect(
    () => {
      if (isRepairCompleted(reporting, patches)) {
        setBannerHide(false);
      } else {
        setBannerHide(true);
      }
    },
    [reporting, patches],
  );

  return (
    <AppBar component="nav" position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ArticleIcon fontSize="large" sx={{ marginRight: '12px' }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              color: 'inherit',
              textDecoration: 'none',
              marginRight: '30px',
            }}
          >
            {inputFileName}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <LightTooltip title={<Typography sx={{ fontSize: '1.4em' }}>Start a new validation</Typography>} placement="left">
            <NewButton sx={{ marginRight: '10px' }} variant="outlined" onClick={() => navigate('..')}>
              <PostAddIcon />
            </NewButton>
          </LightTooltip>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: '5px' }}>
            <OverviewNavMenu />
            {hasCompletenessErrors(reporting) && <CompletenessErrorNavMenu />}
            {hasAdherenceErrors(reporting) && <AdherenceErrorNavMenu />}
          </Box>
        </Toolbar>
      </Container>
      <Collapse direction="down" in={!bannerhide} mountOnEnter unmountOnExit>
        <Banner>
          {isInputSpreadsheetValid
            && (inputFileMetadata.type === XLSX
              || inputFileMetadata.type === CSV
              || inputFileMetadata.type === TXT)
            && 'No error found. Ensure your file is in tab-separated format using the "Download" button below and then upload it to the'}
          {isInputSpreadsheetValid
            && inputFileMetadata.type === TSV
            && 'No error found. Please proceed with uploading your file to the'}
          {!isInputSpreadsheetValid
            && 'Fix completed. Download the repaired spreadsheet using the "Download" button below and upload the file to the'}
          &nbsp;
          <Link
            href="http://ingest.hubmapconsortium.org"
            rel="noopener"
            target="_blank"
          >
            HuBMAP ingest portal
          </Link>
          .
        </Banner>
      </Collapse>
    </AppBar>
  );
};

Navbar.propTypes = {
  inputFileName: PropTypes.string.isRequired,
};

export default Navbar;
