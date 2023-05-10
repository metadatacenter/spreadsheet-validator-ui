import { useContext } from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFileCsv } from '@fortawesome/free-solid-svg-icons';
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
        icon={<FontAwesomeIcon icon={faFileExcel} size="xl" />}
        title="Save to Excel"
        onClick={() => {
          const repairedData = applyPatches(data, patches);
          generateNewSpreadsheet(repairedData, staticSheets);
        }}
        sx={{ width: 45, height: 45 }}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: '1em',
            },
          },
        }}
      />
      <SpeedDialAction
        key="generated-csv"
        icon={<FontAwesomeIcon icon={faFileCsv} size="xl" />}
        title="Save to CSV"
        onClick={() => {
          const repairedData = applyPatches(data, patches);
          generateNewCsv(repairedData);
        }}
        sx={{ width: 45, height: 45 }}
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
