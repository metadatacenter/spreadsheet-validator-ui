export const getDataValue = (row, column, data) => data[row][column];

// eslint-disable-next-line dot-notation
export const getRows = (data) => data.map((row) => row.rowNumber);

export const getColumnSchema = (column, schema) => schema.columnDescription[column];

export const getColumnName = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema.name;
};

export const getColumnLabel = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema.label;
};

export const getColumnType = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema.type;
};

export const getColumnDescription = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema.description;
};

export const getValueExample = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema.example;
};

export const hasValueExample = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema?.example || false;
};

export const isColumnRequired = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema.required;
};

export const hasStringPattern = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema?.regex || false;
};

export const getStringPattern = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema.regex;
};

export const hasPermissibleValues = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema?.permissibleValues || false;
};

export const getPermissibleValues = (column, schema) => {
  const columnSchema = getColumnSchema(column, schema);
  return columnSchema.permissibleValues?.map((v) => v.label);
};

export const getCompletenessErrorReport = (reporting) => (
  reporting.filter((reportItem) => reportItem.errorType === 'missingRequired')
);

export const getCompletenessErrorReportByColumn = (reporting, column) => (
  reporting.filter(
    (reportItem) => reportItem.errorType === 'missingRequired'
      && reportItem.column === column,
  )
);

export const getAdherenceErrorReport = (reporting) => (
  reporting.filter(
    (reportItem) => reportItem.errorType === 'notStandardTerm'
      || reportItem.errorType === 'notNumberType'
      || reportItem.errorType === 'notStringType'
      || reportItem.errorType === 'invalidUrl'
      || reportItem.errorType === 'invalidValueFormat',
  )
);

export const getAdherenceErrorReportByType = (reporting, errorType) => (
  reporting.filter((reportItem) => reportItem.errorType === errorType)
);

export const getPatchGroup = (row, patches) => {
  const mutablePatches = patches;
  const patchGroup = patches[row];
  if (typeof patchGroup === 'undefined') {
    mutablePatches[row] = {};
  }
  return patches[row];
};

export const getPatch = (row, column, patches) => getPatchGroup(row, patches)[column];

export const getPatchValue = (row, column, patches) => getPatch(row, column, patches)?.value;

export const getEffectiveValue = (row, column, data, patches) => {
  // eslint-disable-next-line dot-notation
  let value;
  if (patches[row][column]) {
    value = getPatchValue(row, column, patches);
  } else {
    value = getDataValue(row, column, data);
  }
  return value;
};
