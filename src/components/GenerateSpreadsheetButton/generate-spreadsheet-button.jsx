import { useContext } from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import AppContext from '../../pages/AppContext';
import { applyPatches, generateNewCsv, generateNewSpreadsheet } from '../../helpers/app-utils';

const GenerateSpreadsheetButton = () => {
  const { appData, patches } = useContext(AppContext);
  const { data, otherProps } = appData;
  const { staticSheets } = otherProps;

  return (
    <SpeedDial
      ariaLabel="Generate repaired table data"
      icon={<DownloadIcon />}
      direction="up"
      sx={{ position: 'fixed', bottom: 32, right: 36 }}
    >
      <SpeedDialAction
        key="generated-xlsx"
        icon={<SaveIcon />}
        tooltipTitle="Download Excel file"
        tooltipOpen
        onClick={() => {
          const repairedData = applyPatches(data, patches);
          generateNewSpreadsheet(repairedData, staticSheets);
        }}
      />
      <SpeedDialAction
        key="generated-csv"
        icon={<SaveIcon />}
        tooltipTitle="Download CSV file"
        tooltipOpen
        onClick={() => {
          const repairedData = applyPatches(data, patches);
          generateNewCsv(repairedData);
        }}
      />
    </SpeedDial>
  );
};

export default GenerateSpreadsheetButton;
