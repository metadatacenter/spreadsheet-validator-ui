import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, styled, CircularProgress, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, TextField, Stack } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { FileUploader } from 'react-drag-drop-files';
import { read, utils } from 'xlsx';
import Papa from 'papaparse';
import Container from '../../styles/Container';
import BaseButton from '../../styles/BaseButton';
import logo from '../../logo.svg';
import './home.css';
import { getAdherenceErrorReport, getCompletenessErrorReport } from '../../helpers/data-utils';
import { OVERVIEW_PATH } from '../../constants/Router';
import { CEDAR_TEMPLATE_IRI, MAIN_SHEET, METADATA_SHEET } from '../../constants/Sheet';
import { BLACK, BLUE, LIGHTER_GRAY, WHITE, LIGHT_YELLOW } from '../../constants/Color';
import { CSV, TSV, TXT, XLSX } from '../../constants/MimeType';

const HomeContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  height: '100vh',
});

const InputArea = styled(Box)({
  width: '100vw',
  margin: 'auto',
});

const LogoBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: '10px',
  img: {
    width: '600px',
    marginTop: 'auto',
  },
});

const TaglineBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
});

const InputSection = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  padding: '30px',
});

const UploadBox = styled(Box)({
  width: '500px',
  textAlign: 'center',
  padding: '20px 150px 20px 150px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  border: '1px solid gray',
  borderRadius: '18px',
});

const SubmitBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
});

const CustomWidthTooltip = styled(({ className, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 970,
    color: BLACK,
    backgroundColor: WHITE,
    border: '1px solid #000',
    borderRadius: 10,
  },
});

const validateSpreadsheet = async (spreadsheetData, cedarTemplateIri) => {
  const url = '/service/validate';
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body:
      JSON.stringify({
        spreadsheetData,
        cedarTemplateIri,
      }),
  };
  const res = fetch(url, requestOptions)
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      const data = await response.json();
      return data;
    });
  return res;
};

// eslint-disable-next-line react/prop-types
const Home = ({ setAppData }) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [templateIri, setTemplateIri] = useState();
  const [staticSheets, setStaticSheets] = useState();
  const [inputFileMetadata, setInputFileMetadata] = useState();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const throwInvalidFileError = (message, cause) => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      message,
      cause,
      statusInfo: 'N/A',
      fixSuggestion: 'Please download the latest version of the metadata spreadsheet from the HIVE website.',
    });
  };

  const readBinaryFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      try {
        resolve(content);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsArrayBuffer(file);
  });

  const parseMetadataInExcel = (content) => {
    const workbook = read(content, { type: 'array' });

    let mainSheet = workbook.Sheets[MAIN_SHEET];
    if (!mainSheet) {
      const sheetName = workbook.SheetNames[0];
      mainSheet = workbook.Sheets[sheetName];
    }
    if (!mainSheet) {
      throwInvalidFileError('Invalid input metadata file.', 'The [MAIN] sheet is missing.');
    }
    const dt = utils.sheet_to_json(mainSheet, { defval: '' });
    if (!dt || dt.length === 0) {
      throwInvalidFileError('Invalid input metadata file.', 'The [MAIN] sheet is empty.');
    }
    setData(dt);

    const metadataSheet = workbook.Sheets[METADATA_SHEET];
    if (!metadataSheet) {
      throwInvalidFileError('Invalid input metadata file.', 'The [.metadata] sheet is missing.');
    }
    const md = utils.sheet_to_json(metadataSheet, { defval: '' });
    if (!md || md.length === 0) {
      throwInvalidFileError('Invalid input metadata file.', 'The [.metadata] sheet is empty.');
    }
    const iri = md[0][CEDAR_TEMPLATE_IRI];
    if (!iri) {
      throwInvalidFileError('Invalid input metadata file.', 'The schema IRI is missing in the [.metadata] sheet.');
    }
    setTemplateIri(iri);

    const staticSheetNames = workbook.SheetNames.slice(1);
    const staticSheetObjects = staticSheetNames.reduce((collector, name) => ({
      ...collector,
      [name]: utils.sheet_to_json(workbook.Sheets[name], { defval: '' }),
    }), {});
    setStaticSheets(staticSheetObjects);
  };

  const readTextFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      try {
        resolve(content);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(file);
  });

  const parseMetadataInSeparatedValue = (content) => {
    const FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;
    const defval = (value) => {
      let output = value;
      if (value === 'true' || value === 'TRUE') {
        output = true;
      } else if (value === 'false' || value === 'FALSE') {
        output = false;
      } else if (FLOAT.test(value)) {
        output = parseFloat(value);
      } else {
        return value;
      }
      return output;
    };
    const parsed = Papa.parse(content, {
      header: true,
      delimiter: '', // auto-detect
      newline: '', // auto-detect
      dynamicTyping: false,
      skipEmptyLines: true,
      transform: defval,
    });
    if (!parsed.data || parsed.data.length === 0) {
      throwInvalidFileError('Invalid input metadata file.', 'The file is empty.');
    }
    setData(parsed.data);
    const schemaId = parsed.data[0].metadata_schema_id;
    if (!schemaId) {
      throwInvalidFileError('Invalid input metadata file.', 'The metadata_schema_id is missing in the file.');
    }
    setTemplateIri(`https://repo.metadatacenter.org/templates/${schemaId}`);
  };

  const openErrorDialog = (e) => {
    setError(e);
    setOpenDialog(true);
  };

  const handleChange = (file) => {
    if (file) {
      setEnabled(true);
      const fileType = file.type;
      if (fileType === CSV || fileType === TSV || fileType === TXT) {
        readTextFile(file)
          .then(parseMetadataInSeparatedValue)
          .catch(openErrorDialog);
      } else if (fileType === XLSX) {
        readBinaryFile(file)
          .then(parseMetadataInExcel)
          .catch(openErrorDialog);
      }
      setInputFileMetadata({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const getErrorLocations = (reporting) => {
    const completenessErrorReport = getCompletenessErrorReport(reporting);
    return completenessErrorReport
      .map((reportItem) => reportItem.column)
      .filter((value, index, arr) => arr.indexOf(value) === index);
  };

  const getErrorTypes = (reporting) => {
    const adherenceErrorReport = getAdherenceErrorReport(reporting);
    return adherenceErrorReport
      .map((reportItem) => reportItem.errorType)
      .filter((value, index, arr) => arr.indexOf(value) === index);
  };

  const submitSpreadsheet = async () => {
    try {
      setLoading(true);
      setEnabled(false);
      const response = await validateSpreadsheet(data, templateIri);
      setAppData({
        ...response,
        paths: {
          completenessErrorLocations: getErrorLocations(response.reporting),
          adherenceErrorTypes: getErrorTypes(response.reporting),
        },
        otherProps: {
          inputFileMetadata,
          staticSheets,
        },
      });
      navigate(OVERVIEW_PATH);
    } catch (e) {
      setError(e);
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setLoading(false);
    setEnabled(false);
    setOpenDialog(false);
  };

  const fileTypes = ['xlsx', 'csv', 'tsv', 'txt'];
  return (
    <HomeContainer>
      <Stack direction="column">
        <InputArea>
          <LogoBox>
            <img src={logo} alt="spreadsheet-validator-logo" />
          </LogoBox>
          <TaglineBox>
            <h2>Upload and submit your spreadsheet file to validate the metadata records</h2>
          </TaglineBox>
          <InputSection>
            <FileUploader
              name="file"
              hoverTitle=" "
              handleChange={handleChange}
              types={fileTypes}
              dropMessageStyle={{ backgroundColor: LIGHT_YELLOW }}
            >
              <UploadBox>
                <Typography sx={{ fontSize: '20px' }} color="text.secondary" gutterBottom>
                  {inputFileMetadata ? `${inputFileMetadata.name}` : 'Drag & drop your spreadsheet file here'}
                  {' '}
                  or
                  {' '}
                  <u>Browse</u>
                </Typography>
              </UploadBox>
            </FileUploader>
          </InputSection>
          <SubmitBox sx={{ position: 'relative' }}>
            <BaseButton
              variant="contained"
              size="large"
              onClick={submitSpreadsheet}
              disabled={!enabled}
              sx={{ padding: '12px 80px 12px 80px' }}
            >
              Start Validating
            </BaseButton>
            {loading && (
              <CircularProgress
                size={28}
                title="Loading..."
                sx={{
                  color: BLUE,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </SubmitBox>
          <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            maxWidth="lg"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Validator Error
            </DialogTitle>
            <DialogContent sx={{ width: '700px' }}>
              <DialogContentText id="alert-dialog-description" sx={{ paddingBottom: '30px' }}>
                {error?.message}
              </DialogContentText>
              <TextField
                sx={{ width: '100%', backgroundColor: LIGHTER_GRAY, marginBottom: '30px' }}
                label="Fix suggestion:"
                defaultValue={error?.fixSuggestion || 'Please send the detailed error message below to help@hubmapconsortium.org with a subject "Metadata Validator Error".'}
                multiline
                maxRows={8}
                disabled
              />
              <TextField
                sx={{ width: '100%', backgroundColor: LIGHTER_GRAY }}
                label="Detailed error message:"
                defaultValue={`Status: ${error?.statusInfo}\nCause: ${error?.cause}`}
                multiline
                maxRows={8}
                disabled
              />
            </DialogContent>
            <DialogActions>
              <BaseButton onClick={handleDialogClose} autoFocus>Close</BaseButton>
            </DialogActions>
          </Dialog>
        </InputArea>
        <CustomWidthTooltip
          title={(
            <Typography fontSize={15}>
              Our validator tool collects data for research, performance evaluation, and
              capability improvement purposes. We want to emphasize that no personal data
              or the actual data you submit is ever collected. Our data collection is
              restricted to the validation reporting and session IDs, all of which are
              instrumental in our research study, tool evaluation, and enhancement efforts.
              By clicking the &apos;START VALIDATING&apos; button above, you agree to our
              data collection privacy policy. If you have any concerns or questions regarding
              this data collection, please feel free to contact us.
            </Typography>
          )}
          width="800px"
          placement="top"
        >
          <Button
            component="div"
            sx={{ position: 'fixed', left: '50%', bottom: 10, margin: '0 auto', transform: 'translate(-50%,-50%)', color: BLACK }}
          >
            Data Privacy Policy
          </Button>
        </CustomWidthTooltip>
      </Stack>
    </HomeContainer>
  );
};

export default Home;
