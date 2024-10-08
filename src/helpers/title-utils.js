export const getOverviewTitle = () => (
  'Overview'
);

export const getValidationResultTitle = () => (
  'Validation Result'
);

export const getCompletenessErrorRepairTitle = () => (
  'Repair Completeness Errors'
);

export const getAdherenceErrorRepairTitle = () => (
  'Repair Adherence Errors'
);

export const getTotalErrorCountTitle = (report, errorType, column = '') => {
  let title = `Unknown error type: ${errorType}`;
  const errorSize = report.length;
  if (errorType === 'missingRequired') {
    title = `Found ${errorSize} ${errorSize === 1 ? 'metadata record that has' : 'metadata records that have'} a missing "${column}" value`;
  } else if (errorType === 'notStandardTerm') {
    title = `Found ${errorSize} ${errorSize === 1 ? 'value that is' : 'values that are'} not using the standard term`;
  } else if (errorType === 'notNumberType') {
    title = `Found ${errorSize} ${errorSize === 1 ? 'value that is' : 'values that are'} not a number`;
  } else if (errorType === 'notStringType') {
    title = `Found ${errorSize} ${errorSize === 1 ? 'value that is' : 'values that are'} not a string`;
  } else if (errorType === 'invalidUrl') {
    title = `Found ${errorSize} ${errorSize === 1 ? 'value that is' : 'values that are'} not a valid URL string`;
  } else if (errorType === 'invalidValueFormat') {
    title = `Found ${errorSize} ${errorSize === 1 ? 'value that is' : 'values that are'} not matching the expected string format`;
  } else if (errorType === 'invalidSchemaId') {
    title = `Found ${errorSize} ${errorSize === 1 ? 'value that is' : 'values that are'} not a valid metadata schema ID`;
  }
  return title;
};

export const getNavigationSubMenuTitle = (errorType, column = '') => {
  let title = `Unknown error type: ${errorType}`;
  if (errorType === 'missingRequired') {
    title = `Missing "${column}" value`;
  } else if (errorType === 'notStandardTerm') {
    title = 'Value is not a standard term';
  } else if (errorType === 'notNumberType') {
    title = 'Value is not number';
  } else if (errorType === 'notStringType') {
    title = 'Value is not string';
  } else if (errorType === 'invalidUrl') {
    title = 'Value is not a valid URL';
  } else if (errorType === 'invalidValueFormat') {
    title = 'Value is not in valid format';
  } else if (errorType === 'invalidSchemaId') {
    title = 'Value is not a valid schema ID';
  }
  return title;
};

export const getErrorFlagTitle = (errorType, column = '') => (
  getNavigationSubMenuTitle(errorType, column)
);

export const getActionButtonTitle = (errorType, column = '') => {
  let title = `Unknown error type: ${errorType}`;
  if (errorType === 'missingRequired') {
    title = `Fill out missing "${column}" value`;
  } else if (errorType === 'notStandardTerm') {
    title = 'Replace value with the standard term';
  } else if (errorType === 'notNumberType') {
    title = 'Replace value with a number';
  } else if (errorType === 'notStringType') {
    title = 'Replace value with a string';
  } else if (errorType === 'invalidUrl') {
    title = 'Replace value with a valid URL';
  } else if (errorType === 'invalidValueFormat') {
    title = 'Replace value with the expected string format';
  } else if (errorType === 'invalidSchemaId') {
    title = 'Replace value with valid metadata schema ID';
  }
  return title;
};
