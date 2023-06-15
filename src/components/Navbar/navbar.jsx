import { useContext } from 'react';
import { AppBar, Box, Toolbar, Typography, Container } from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import AppContext from '../../pages/AppContext';
import CompletenessErrorNavMenu from '../NavMenu/CompletenessErrorNavMenu';
import AdherenceErrorNavMenu from '../NavMenu/AdherenceErrorNavMenu';
import OverviewNavMenu from '../NavMenu/OverviewNavMenu';
import { hasCompletenessErrors, hasAdherenceErrors } from '../../helpers/app-utils';

const Navbar = () => {
  const { appData } = useContext(AppContext);
  const { reporting } = appData;
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
    </AppBar>
  );
};

export default Navbar;
