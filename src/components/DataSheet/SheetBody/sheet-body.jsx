import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FormControl, TableBody, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import SheetCell from '../SheetCell';
import DropDownSelector from '../DropDownSelector';
import InputField from '../InputField';
import WrappedText from '../WrappedText/wrapped-text';
import { getDataTypeForColumn, getPermissibleValuesForColumn } from '../../../helpers/data-utils';
import { DATE, EMAIL, NUMBER, PHONE, TEXT, TIME, URL } from '../../../constants/ValueType';
import { LIGHT_RED } from '../../../constants/Color';

// eslint-disable-next-line react/prop-types, max-len
const SheetBody = ({ metadata, data, columnOrder, batchInput, userInput, setUserInput, page, rowsPerPage, staleBatch }) => {
  const { column } = useParams();
  const pagedRows = useMemo(
    () => (rowsPerPage > 0
      ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data),
    [data, page, rowsPerPage],
  );
  // eslint-disable-next-line dot-notation
  const rowIndexes = pagedRows.map((row) => row['_id']);
  const batchValue = batchInput[column];
  if (typeof batchValue !== 'undefined' && !staleBatch) {
    setUserInput((prevUserInput) => {
      // eslint-disable-next-line no-param-reassign
      rowIndexes.forEach((rowIndex) => { prevUserInput[rowIndex] = batchValue; });
    });
  }
  return (
    <TableBody>
      {pagedRows.map((row) => {
        // eslint-disable-next-line dot-notation
        const rowIndex = row['_id'];
        const handleInputChange = (event) => {
          setUserInput((prevUserInput) => {
            // eslint-disable-next-line no-param-reassign
            prevUserInput[rowIndex] = event.target.value;
          });
        };
        return (
          <TableRow>
            {columnOrder.map((columnName, columnIndex) => {
              const permissibleValues = getPermissibleValuesForColumn(columnName, metadata);
              const columnType = getDataTypeForColumn(columnName, metadata);
              let component;
              if (columnIndex === 0) {
                component = (
                  <SheetCell sx={{ zIndex: 998 }} sticky>
                    <FormControl fullWidth>
                      {permissibleValues
                        && (
                          <DropDownSelector
                            value={userInput[rowIndex] || ''}
                            options={permissibleValues}
                            onChange={handleInputChange}
                            colorOnEmpty={LIGHT_RED}
                          />
                        )}
                      {!permissibleValues
                        && (
                          <InputField
                            value={userInput[rowIndex] || ''}
                            type={columnType}
                            onChange={handleInputChange}
                            colorOnEmpty={LIGHT_RED}
                          />
                        )}
                    </FormControl>
                  </SheetCell>
                );
              } else {
                component = (
                  <SheetCell align="right">
                    <WrappedText text={row[columnName]} />
                  </SheetCell>
                );
              }
              return component;
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

SheetBody.propTypes = {
  metadata: PropTypes.shape({
    spreadsheet: PropTypes.shape({
      label: PropTypes.string.isRequired,
      columns: PropTypes.objectOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          type: PropTypes.oneOf([TEXT, NUMBER, DATE, TIME, EMAIL, URL, PHONE]).isRequired,
          permissibleValues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
        }),
      ).isRequired,
    }).isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.any),
  ).isRequired,
  columnOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default SheetBody;
