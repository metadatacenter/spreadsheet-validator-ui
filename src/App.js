import { useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Stack, Button, styled } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PropTypes from 'prop-types';
import './App.css';
import Home from './pages/Home';
import Overview from './pages/Overview';
import CompletenessErrorOverview from './pages/CompletenessErrorOverview';
import AdherenceErrorOverview from './pages/AdherenceErrorOverview';
import CompletenessErrorRepair from './pages/CompletenessErrorRepair';
import AdherenceErrorRepair from './pages/AdherenceErrorRepair';
import Container from './styles/Container';
import AppContext from './pages/AppContext';
import Navbar from './components/Navbar';
import ContentArea from './components/ContentArea';
import PageFooter from './components/PageFooter';
import HelpButton from './components/HelpButton';
import GenerateSpreadsheetButton from './components/GenerateSpreadsheetButton';
import { generateEmptyObjects } from './helpers/array-utils';
import { HOME_PATH, OVERVIEW_PATH, COMPLETENESS_ERROR_PATH, ADHERENCE_ERROR_PATH } from './constants/Router';
import { LIGHTER_GRAY, BLACK } from './constants/Color';

const MainContainer = styled(Container)({
  backgroundColor: LIGHTER_GRAY,
});

const LandingPageContainer = () => (
  <Stack direction="column">
    <Stack direction="row" spacing={2} sx={{ padding: '25px', zIndex: 999 }}>
      <Button
        component="a"
        startIcon={<HelpOutlineIcon />}
        href="https://metadatacenter.github.io/spreadsheet-validator-docs/"
        rel="noopener"
        target="_blank"
        sx={{ color: BLACK }}
      >
        Help
      </Button>
      <Button
        component="a"
        startIcon={<FileDownloadIcon />}
        href="https://hubmapconsortium.github.io/ingest-validation-tools/"
        rel="noopener"
        target="_blank"
        sx={{ color: BLACK }}
      >
        Metadata Spreadsheet
      </Button>
      <Button component="div" disabled>UI Version: 1.3.1</Button>
    </Stack>
    <Outlet />
  </Stack>
);

const WorkspaceContainer = ({ appData }) => {
  const { data, otherProps } = appData;
  const initPatches = generateEmptyObjects(data.length);
  const [patches, updatePatches] = useImmer(initPatches);
  const appContextData = useMemo(() => ({ appData, patches, updatePatches }), [patches]);
  const inputFileName = otherProps.inputFileMetadata.name;
  return (
    <AppContext.Provider value={appContextData}>
      <MainContainer>
        <Navbar inputFileName={inputFileName} />
        <ContentArea />
        <PageFooter />
        <HelpButton />
        <GenerateSpreadsheetButton />
      </MainContainer>
    </AppContext.Provider>
  );
};

WorkspaceContainer.propTypes = {
  appData: PropTypes.shape({
    schema: PropTypes.oneOfType([PropTypes.object]).isRequired,
    data: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object]),
    ).isRequired,
    reporting: PropTypes.arrayOf(
      PropTypes.shape({
        row: PropTypes.number.isRequired,
        column: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        repairSuggestion: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        errorType: PropTypes.string.isRequired,
      }),
    ).isRequired,
    otherProps: PropTypes.shape({
      inputFileMetadata: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

const App = () => {
  const [appData, setAppData] = useState({ schema: {}, data: [], reporting: [] });
  return (
    <Router>
      <Routes>
        <Route element={<LandingPageContainer />}>
          <Route path={HOME_PATH} element={<Home setAppData={setAppData} />} />
        </Route>
        <Route element={(<WorkspaceContainer appData={appData} />)}>
          <Route path={OVERVIEW_PATH} element={<Overview />} />
          <Route
            path={COMPLETENESS_ERROR_PATH}
            element={<CompletenessErrorOverview />}
          />
          <Route
            path={`${COMPLETENESS_ERROR_PATH}/:targetColumn`}
            element={<CompletenessErrorRepair />}
          />
          <Route
            path={ADHERENCE_ERROR_PATH}
            element={<AdherenceErrorOverview />}
          />
          <Route
            path={`${ADHERENCE_ERROR_PATH}/:errorType`}
            element={<AdherenceErrorRepair />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
