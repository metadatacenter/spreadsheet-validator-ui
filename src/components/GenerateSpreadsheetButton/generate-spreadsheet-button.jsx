import { useContext } from 'react';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { ReactComponent as TsvIcon } from '../../assets/tsv-file.svg';
import { ReactComponent as XlsxIcon } from '../../assets/xlsx-file.svg';
import AppContext from '../../pages/AppContext';
import { applyPatches, generateNewTsv, generateNewSpreadsheet } from '../../helpers/app-utils';

const GenerateSpreadsheetButton = () => {
  const { appData, patches } = useContext(AppContext);
  const { data, otherProps } = appData;
  const { staticSheets } = otherProps;

  return (
    <SpeedDial
      ariaLabel="Generate repaired table data"
      FabProps={{ variant: 'extended' }}
      icon={(
        <SpeedDialIcon
          icon={(
            <Box sx={{ display: 'flex' }}>
              <DownloadIcon />
              &nbsp;
              <Typography>Download</Typography>
            </Box>
          )}
          openIcon={(
            <Box sx={{ display: 'flex' }}>
              <DownloadIcon />
              &nbsp;
              <Typography>Download</Typography>
            </Box>
          )}
        />
      )}
      direction="up"
      sx={{ position: 'fixed', bottom: 32, right: 36 }}
    >
      <SpeedDialAction
        key="generate-tsv"
        icon={<TsvIcon style={{ width: '32px', height: '32px' }} />}
        title="Save to TSV"
        onClick={() => {
          const repairedData = applyPatches(data, patches);
          generateNewTsv(repairedData);
        }}
        sx={{ width: 60, height: 60 }}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: '1em',
            },
          },
        }}
      />
      <SpeedDialAction
        key="generate-xlsx"
        icon={<XlsxIcon style={{ width: '32px', height: '32px' }} />}
        title="Save to Excel"
        onClick={() => {
          const repairedData = applyPatches(data, patches);
          generateNewSpreadsheet(repairedData, staticSheets);
        }}
        sx={{ width: 60, height: 60 }}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: '1em',
            },
          },
        }}
      />
    </SpeedDial>
  );
};

export default GenerateSpreadsheetButton;
