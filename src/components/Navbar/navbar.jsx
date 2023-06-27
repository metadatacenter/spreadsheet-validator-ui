import { useContext, useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography, Container, Link, Collapse, styled } from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import AppContext from '../../pages/AppContext';
import CompletenessErrorNavMenu from '../NavMenu/CompletenessErrorNavMenu';
import AdherenceErrorNavMenu from '../NavMenu/AdherenceErrorNavMenu';
import OverviewNavMenu from '../NavMenu/OverviewNavMenu';
import { hasCompletenessErrors, hasAdherenceErrors, isRepairCompleted } from '../../helpers/app-utils';
import { BLACK, GREEN } from '../../constants/Color';

const Banner = styled(Box)({
  backgroundColor: GREEN,
  color: BLACK,
  padding: '16px',
  fontSize: '18px',
  textAlign: 'center',
});

const Navbar = () => {
  const [hide, setHide] = useState(true);
  const { appData, patches } = useContext(AppContext);
  const { reporting } = appData;
  const noErrorFound = reporting.length === 0;

  useEffect(
    () => {
      if (isRepairCompleted(reporting, patches)) {
        setHide(false);
      } else {
        setHide(true);
      }
    },
    [reporting, patches],
  );

  return (
    <AppBar component="nav" position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BuildCircleIcon sx={{ paddingRight: 1 }} />
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
            Metadata Spreadsheet Validator
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <OverviewNavMenu />
            {hasCompletenessErrors(reporting) && <CompletenessErrorNavMenu />}
            {hasAdherenceErrors(reporting) && <AdherenceErrorNavMenu />}
          </Box>
        </Toolbar>
      </Container>
      <Collapse direction="down" in={!hide} mountOnEnter unmountOnExit>
        <Banner>
          {noErrorFound ? (
            'No errors found. Please proceed to upload the spreadsheet to the'
          ) : (
            'Fix completed. Download the repaired spreadsheet and proceed to upload it to the'
          )}
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

export default Navbar;
