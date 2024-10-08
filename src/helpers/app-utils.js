import * as jsonpatch from 'fast-json-patch';
import { writeFile, utils } from 'xlsx';
import Papa from 'papaparse';
import { GREEN, RED } from '../constants/Color';
import { add } from './array-utils';
import { getEffectiveValue } from './data-utils';
import { getErrorFlagTitle } from './title-utils';

export const getPagedData = (data, page, rowsPerPage) => (
  (rowsPerPage > 0
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data)
);

const checkMissingRequiredError = (reportItem) => (
  reportItem.errorType === 'missingRequired'
);

const checkCompletenessError = (reportItem) => (
  checkMissingRequiredError(reportItem)
);

const checkNotStandardTermError = (reportItem) => (
  reportItem.errorType === 'notStandardTerm'
);

const checkNotNumberTypeError = (reportItem) => (
  reportItem.errorType === 'notNumberType'
);

const checkNotStringTypeError = (reportItem) => (
  reportItem.errorType === 'notStringType'
);

const checkInvalidUrlError = (reportItem) => (
  reportItem.errorType === 'invalidUrl'
);

const checkInvalidValueFormatError = (reportItem) => (
  reportItem.errorType === 'invalidValueFormat'
);

const checkInvalidSchemaIdError = (reportItem) => (
  reportItem.errorType === 'invalidSchemaId'
);

const checkAdherenceError = (reportItem) => (
  checkNotStandardTermError(reportItem)
  || checkNotNumberTypeError(reportItem)
  || checkNotStringTypeError(reportItem)
  || checkInvalidUrlError(reportItem)
  || checkInvalidValueFormatError(reportItem)
  || checkInvalidSchemaIdError(reportItem)
);

export const hasCompletenessErrors = (reportingData) => (
  reportingData.some((item) => checkCompletenessError(item))
);

export const hasAdherenceErrors = (reportingData) => (
  reportingData.some((item) => checkAdherenceError(item))
);

export const generateEvaluationSummaryData = (spreadsheetData, reportingData) => {
  const dataSize = spreadsheetData.length;
  const errorSize = [...new Set(reportingData.map((item) => item.row))].length;
  const validSize = dataSize - errorSize;
  return {
    labels: ['Invalid metadata', 'Valid metadata'],
    innerTextTitle: `${errorSize} / ${dataSize}`,
    innerTextSubtitle: 'Overview',
    datasets: [{
      label: '',
      data: [errorSize, validSize],
      backgroundColor: [RED, GREEN],
    }],
    hasCompletenessErrors: hasCompletenessErrors(reportingData),
    hasAdherenceErrors: hasAdherenceErrors(reportingData),
  };
};

export const generateMissingValueAnalysisChartData = (spreadsheetData, errorSummaryData) => ({
  columns: ['Field name', '# of invalid metadata records'],
  rows: errorSummaryData
    .filter((item) => checkCompletenessError(item))
    .sort((item1, item2) => (item2.rows.length - item1.rows.length))
    .map((item) => [
      item.column,
      [
        { value: item.rows.length, color: RED },
        { value: spreadsheetData.length - item.rows.length, color: GREEN },
      ],
    ]),
});

export const generateInvalidValueTypeAnalysisChartData = (spreadsheetData, errorSummaryData) => ({
  columns: ['Field name', 'Error flag', '# of invalid metadata records'],
  rows: errorSummaryData
    .filter((item) => checkAdherenceError(item))
    .sort((item1, item2) => (item2.rows.length - item1.rows.length))
    .map((item) => [
      item.column,
      getErrorFlagTitle(item.errorType),
      [
        { value: item.rows.length, color: RED },
        { value: spreadsheetData.length - item.rows.length, color: GREEN },
      ],
    ]),
});

export const createAddOperationPatch = (row, column, value) => ({
  op: 'add',
  path: `/${row}/${column}`,
  value,
});

export const createReplaceOperationPatch = (row, column, value) => ({
  op: 'replace',
  path: `/${row}/${column}`,
  value,
});

export const checkRepairPatchPresent = (row, column, patches) => (
  !!patches[row]
  && !!patches[row][column]
  && typeof patches[row][column].value !== 'undefined'
);

export const isRepairCompleted = (reporting, patches) => (
  reporting.reduce(
    (accumulator, errorDetails) => {
      const { row, column } = errorDetails;
      return accumulator && checkRepairPatchPresent(row, column, patches);
    },
    true,
  )
);

const countRemainingErrors = (summaryItem, patches) => {
  const { rows, column } = summaryItem;
  return rows.map((row) => checkRepairPatchPresent(row, column, patches))
    .map((bool) => (bool ? 0 : 1))
    .reduce(add, 0);
};

export const generateCompletenessErrorStatusList = (errorSummary, patches) => {
  const filteredSummary = errorSummary.filter(
    (item) => checkCompletenessError(item),
  );
  return filteredSummary.map(
    (summaryItem) => {
      const { column } = summaryItem;
      return ({
        errorId: `missing-required-${column}`,
        errorType: 'missingRequired',
        errorCount: countRemainingErrors(summaryItem, patches),
        errorLocation: column,
      });
    },
  );
};

const countRemainingErrorsFromErrorSummary = (errorSummary, patches) => (
  errorSummary.reduce(
    (accumulator, summaryItem) => accumulator + countRemainingErrors(summaryItem, patches),
    0,
  )
);

const getNotStandardTermButtonItemData = (errorSummary, patches) => {
  const filteredSummary = errorSummary.filter(
    (reportItem) => checkNotStandardTermError(reportItem),
  );
  if (filteredSummary.length > 0) {
    return {
      errorId: 'not-standard-term-error',
      errorType: 'notStandardTerm',
      errorCount: countRemainingErrorsFromErrorSummary(filteredSummary, patches),
      errorLocation: null,
    };
  }
  return null;
};

const getNotNumberTypeButtonItemData = (errorSummary, patches) => {
  const filteredSummary = errorSummary.filter(
    (reportItem) => checkNotNumberTypeError(reportItem),
  );
  if (filteredSummary.length > 0) {
    return {
      errorId: 'not-number-type-error',
      errorType: 'notNumberType',
      errorCount: countRemainingErrorsFromErrorSummary(filteredSummary, patches),
      errorLocation: null,
    };
  }
  return null;
};

const getNotStringTypeButtonItemData = (errorSummary, patches) => {
  const filteredSummary = errorSummary.filter(
    (reportItem) => checkNotStringTypeError(reportItem),
  );
  if (filteredSummary.length > 0) {
    return {
      errorId: 'not-string-type-error',
      errorType: 'notStringType',
      errorCount: countRemainingErrorsFromErrorSummary(filteredSummary, patches),
      errorLocation: null,
    };
  }
  return null;
};

const getInvalidUrlButtonItemData = (errorSummary, patches) => {
  const filteredSummary = errorSummary.filter(
    (reportItem) => checkInvalidUrlError(reportItem),
  );
  if (filteredSummary.length > 0) {
    return {
      errorId: 'invalid-url-error',
      errorType: 'invalidUrl',
      errorCount: countRemainingErrorsFromErrorSummary(filteredSummary, patches),
      errorLocation: null,
    };
  }
  return null;
};

const getInvalidValueFormatButtonItemData = (errorSummary, patches) => {
  const filteredSummary = errorSummary.filter(
    (reportItem) => checkInvalidValueFormatError(reportItem),
  );
  if (filteredSummary.length > 0) {
    return {
      errorId: 'invalid-value-format-error',
      errorType: 'invalidValueFormat',
      errorCount: countRemainingErrorsFromErrorSummary(filteredSummary, patches),
      errorLocation: null,
    };
  }
  return null;
};

const getInvalidSchemaIdButtonItemData = (errorSummary, patches) => {
  const filteredSummary = errorSummary.filter(
    (reportItem) => checkInvalidSchemaIdError(reportItem),
  );
  if (filteredSummary.length > 0) {
    return {
      errorId: 'invalid-schema-id-error',
      errorType: 'invalidSchemaId',
      errorCount: countRemainingErrorsFromErrorSummary(filteredSummary, patches),
      errorLocation: null,
    };
  }
  return null;
};

export const generateAdherenceErrorStatusList = (errorSummary, patches) => [
  getNotStandardTermButtonItemData(errorSummary, patches),
  getNotNumberTypeButtonItemData(errorSummary, patches),
  getNotStringTypeButtonItemData(errorSummary, patches),
  getInvalidUrlButtonItemData(errorSummary, patches),
  getInvalidValueFormatButtonItemData(errorSummary, patches),
  getInvalidSchemaIdButtonItemData(errorSummary, patches),
].filter(
  (item) => item !== null,
);

export const generateErrorSummaryReport = (reporting) => (
  Object.values(
    reporting.reduce(
      (accumulator, reportItem) => {
        const { row, column, errorType } = reportItem;
        const key = `${column}-${errorType}`;
        const matchingGroup = (
          // eslint-disable-next-line no-multi-assign
          accumulator[key] = accumulator[key] || {
            column,
            rows: [],
            errorType,
          }
        );
        matchingGroup.rows.push(row);
        return accumulator;
      },
      {}, // initial accumulator value
    ),
  )
);

const getRecord = (row, data, patches) => {
  const oldRecord = data[row];
  const newRecord = { ...oldRecord };
  Object.keys(newRecord).forEach((column) => {
    newRecord[column] = getEffectiveValue(row, column, data, patches);
  });
  return newRecord;
};

export const generateCompletenessErrorTableData = (errorReport, data, patches) => (
  errorReport.map(
    (reportItem) => {
      const { row } = reportItem;
      return getRecord(row, data, patches);
    },
  )
);

export const generateAdherenceErrorTableData = (errorReport, data, patches) => {
  const result = errorReport.reduce(
    (accumulator, reportItem) => {
      const { row, column, value, errorType } = reportItem;
      const key = `${column}-${value}-${errorType}`;
      const matchingGroup = (
        // eslint-disable-next-line no-multi-assign
        accumulator[key] = accumulator[key] || {
          ...reportItem,
          id: key,
          rows: [],
          records: [],
        }
      );
      matchingGroup.rows.push(row);
      matchingGroup.records.push(getRecord(row, data, patches));
      return accumulator;
    },
    {},
  );
  return Object.values(result);
};

export const applyPatches = (data, patches) => {
  const patchArray = patches.map((patch) => (Object.values(patch))).flat();
  return jsonpatch.applyPatch(data, patchArray).newDocument;
};

const validatePath = (fileName, fileExtension) => {
  const pos = fileName.lastIndexOf('.');
  return `${fileName.substr(0, pos < 0 ? fileName.length : pos)}${fileExtension}`;
};

export const generateNewSpreadsheet = (repairedData, staticSheets, outputFile) => {
  const wb = utils.book_new();

  // The main metadata sheet
  const finalData = repairedData.map(({ rowNumber, ...rest }) => ({ ...rest })); // omit rowNumber
  const main = utils.json_to_sheet(finalData);
  utils.book_append_sheet(wb, main, 'MAIN');

  // The other static sheets
  // eslint-disable-next-line no-unused-vars
  const staticSheetNames = Object.keys(staticSheets);
  staticSheetNames.forEach((sheetName) => {
    const ss = utils.json_to_sheet(staticSheets[sheetName]);
    utils.book_append_sheet(wb, ss, sheetName);
  });
  writeFile(wb, validatePath(outputFile, '.xlsx'));
};

const downloadFile = (data, filename) => {
  const element = document.createElement('a');
  const file = new Blob([data], { type: 'text/csv' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

export const generateNewCsv = (repairedData, outputFile) => {
  const finalData = repairedData.map(({ rowNumber, ...rest }) => ({ ...rest })); // omit rowNumber
  const csv = Papa.unparse(finalData);
  downloadFile(csv, validatePath(outputFile, '.csv'));
};

export const generateNewTsv = (repairedData, outputFile) => {
  const finalData = repairedData.map(({ rowNumber, ...rest }) => ({ ...rest })); // omit rowNumber
  const tsv = Papa.unparse(finalData, { delimiter: '\t' });
  downloadFile(tsv, validatePath(outputFile, '.tsv'));
};
