import { useContext } from 'react';
import { AppBar, Container, Slide, styled, Toolbar } from '@mui/material';
import AppContext from '../../pages/AppContext';
import BaseButton from '../../styles/BaseButton';
import { applyPatches, generateNewCsv, generateNewSpreadsheet } from '../../helpers/app-utils';
import { WHITE, LIME, LIGHT_LIME } from '../../constants/Color';

const GenerateButton = styled(BaseButton)({
  width: '360px',
  variant: 'contained',
  backgroundColor: LIGHT_LIME,
  color: WHITE,
  '&:hover': {
    backgroundColor: LIME,
  },
});

const GenerateSpreadsheetButton = () => {
  const { appData, patches } = useContext(AppContext);
  const { data, otherProps } = appData;
  const { staticSheets } = otherProps;

  return (
    <Slide appear={false} direction="up" in="false">
      <AppBar position="fixed" component="div" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Toolbar disableGutters>
            <GenerateButton onClick={() => {
              const repairedData = applyPatches(data, patches);
              generateNewCsv(repairedData);
              generateNewSpreadsheet(repairedData, staticSheets);
            }}
            >
              Generate Repaired Spreadsheet
            </GenerateButton>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default GenerateSpreadsheetButton;
