import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography, Container, Link, Collapse, styled } from '@mui/material';
import { PropTypes } from 'prop-types';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import AppContext from '../../pages/AppContext';
import CompletenessErrorNavMenu from '../NavMenu/CompletenessErrorNavMenu';
import AdherenceErrorNavMenu from '../NavMenu/AdherenceErrorNavMenu';
import OverviewNavMenu from '../NavMenu/OverviewNavMenu';
import { hasCompletenessErrors, hasAdherenceErrors, isRepairCompleted } from '../../helpers/app-utils';
import { BLACK, GREEN, WHITE } from '../../constants/Color';
import { XLSX, TSV } from '../../constants/MimeType';

const NewButton = styled(Button)({
  color: WHITE,
  border: '1px solid WHITE',
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
          <BuildCircleIcon fontSize="large" sx={{ paddingRight: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {inputFileName}
          </Typography>
          <Box>
            <NewButton variant="outlined" onClick={() => navigate('..')}>
              NEW VALIDATION
            </NewButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <OverviewNavMenu />
            {hasCompletenessErrors(reporting) && <CompletenessErrorNavMenu />}
            {hasAdherenceErrors(reporting) && <AdherenceErrorNavMenu />}
          </Box>
        </Toolbar>
      </Container>
      <Collapse direction="down" in={!bannerhide} mountOnEnter unmountOnExit>
        <Banner>
          {isInputSpreadsheetValid && inputFileMetadata.type === XLSX && 'No error found. Please get the TSV format using the download button and upload it to the'}
          {isInputSpreadsheetValid && inputFileMetadata.type === TSV && 'No error found. Please proceed to upload the spreadsheet to the'}
          {!isInputSpreadsheetValid && 'Fix completed. Download the repaired spreadsheet in TSV format and proceed to upload it to the'}
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
