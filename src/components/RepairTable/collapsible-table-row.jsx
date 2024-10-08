/* eslint-disable object-curly-newline */
import { useState } from 'react';
import { Box, Checkbox, Collapse, IconButton, styled, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';
import SheetHeader from '../DataSheet/SheetHeader';
import SheetBody from '../DataSheet/SheetBody';
import SheetCell from '../DataSheet/SheetCell';
import InfoTooltip from './info-tooltip';
import { SheetTable } from './styled';
import {
  getColumnDescription,
  getColumnLabel,
  getColumnType,
  getStringPattern,
  getPermissibleValues,
  getValueExample,
  hasValueExample,
  isColumnRequired,
} from '../../helpers/data-utils';
import { BLACK, DARK_GRAY, GREEN, LIGHTER_GRAY, RED } from '../../constants/Color';
import { nullOnEmpty } from '../../helpers/string-utils';
import EditableSheetCell from './editable-sheet-cell';
import StaticSheetCell from './static-sheet-cell';

const CellValue = styled(Typography)({
  fontSize: '17px',
});

const printFrequency = (rows) => {
  const frequency = rows.length;
  return (frequency === 1) ? `(${frequency} row)` : `(${frequency} rows)`;
};

// eslint-disable-next-line max-len
const CollapsibleTableRow = ({ rowData, schema, inputRef, userInput, updateUserInput }) => {
  const [open, setOpen] = useState(false);
  const [updateTooltipTextTimeout, setUpdateTooltipTextTimeout] = useState(0);
  const [copyTooltipText, setCopyTooltipText] = useState('Click to copy');

  const { id, column: targetColumn, value, rows, records } = rowData;
  const targetColumnLabel = getColumnLabel(targetColumn, schema);
  const required = isColumnRequired(targetColumn, schema);
  const hasExample = hasValueExample(targetColumn, schema);

  return (
    <>
      <TableRow key={`summary-row-${id}`}>
        <SheetCell key={`target-column-cell-${id}`}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CellValue sx={{ fontWeight: 'bold', paddingLeft: '15px' }}>
              {targetColumnLabel}
              {required ? <span style={{ color: RED }}>*</span> : ''}
            </CellValue>
            <InfoTooltip title={getColumnDescription(targetColumn, schema)}>
              <HelpOutlineIcon fontSize="small" sx={{ color: DARK_GRAY, paddingLeft: '5px' }} />
            </InfoTooltip>
            {hasExample && (
              <InfoTooltip title={`Example: ${getValueExample(targetColumn, schema)}`}>
                <InfoOutlinedIcon fontSize="small" sx={{ color: DARK_GRAY, paddingLeft: '5px' }} />
              </InfoTooltip>
            )}
          </Box>
        </SheetCell>
        <SheetCell key={`target-value-cell-${id}`}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%' }}>
              <CellValue noWrap sx={{ paddingRight: '8px', userSelect: 'auto' }}>
                <InfoTooltip title={copyTooltipText} placement="right" arrow>
                  <Typography
                    component="span"
                    onClick={() => {
                      navigator.clipboard.writeText(value);
                      setCopyTooltipText('Copied!');
                      setUpdateTooltipTextTimeout(setTimeout(() => setCopyTooltipText('Click to copy'), 5000));
                    }}
                    onMouseEnter={() => setCopyTooltipText('Click to copy')}
                    onMouseLeave={() => clearTimeout(updateTooltipTextTimeout)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {value}
                  </Typography>
                </InfoTooltip>
              </CellValue>
              <CellValue
                sx={{
                  fontStyle: 'italic',
                  fontSize: '12pt',
                  color: DARK_GRAY,
                }}
              >
                {printFrequency(rows)}
              </CellValue>
            </Box>
            <CellValue>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </CellValue>
          </Box>
        </SheetCell>
        <EditableSheetCell
          key={`suggested-value-cell-${id}`}
          value={userInput[id]?.value || ''}
          type={getColumnType(targetColumn, schema)}
          inputPattern={getStringPattern(targetColumn, schema)}
          permissibleValues={getPermissibleValues(targetColumn, schema)}
          inputRef={inputRef}
          onSave={(userValue) => {
            updateUserInput((currentUserInput) => {
              // eslint-disable-next-line no-param-reassign
              currentUserInput[id] = {
                column: targetColumn,
                value: nullOnEmpty(userValue),
                rows,
                approved: true,
              };
            });
          }}
          highlightEmpty={required || (!required && !userInput[id]?.approved)}
        />
        <SheetCell key={`approved-cell-${id}`} align="center">
          <Checkbox
            key={`checkbox-${id}`}
            onChange={(event) => {
              const { checked: approved } = event.target;
              updateUserInput((currentUserInput) => {
                // eslint-disable-next-line no-param-reassign
                currentUserInput[id] = {
                  column: targetColumn,
                  // if value is undefined, should be replaced with null to create a patch
                  value: userInput[id].value || null,
                  rows,
                  approved,
                };
              });
            }}
            checked={userInput[id]?.approved || false}
          />
        </SheetCell>
      </TableRow>
      <TableRow key={`table-row-${id}`}>
        <SheetCell
          key={`collapse-cell-span-${id}`}
          sx={{
            border: 0,
            paddingBottom: 0,
            paddingTop: 0,
            overflowY: 'auto',
            overflowX: 'auto',
            maxHeight: '400px',
            maxWidth: '1100px',
          }}
          colSpan={5}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ padding: 1, marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Spreadsheet Data
              </Typography>
              <SheetTable size="small">
                <SheetHeader>
                  {schema.columnOrder.map((column) => {
                    const columnDescription = schema.columnDescription[column];
                    const { name: columnName, label: columnLabel } = columnDescription;
                    return (
                      <StaticSheetCell
                        key={`table-header-${columnName}`}
                        value={columnLabel}
                        backgroundColor={LIGHTER_GRAY}
                        minWidth="120px"
                      />
                    );
                  })}
                </SheetHeader>
                <SheetBody>
                  {records.map((record) => (
                    <TableRow key={`row-${record.rowNumber}`}>
                      {schema.columnOrder.map((column) => {
                        const columnDescription = schema.columnDescription[column];
                        const { name: columnName } = columnDescription;
                        const getTextColor = (colName) => {
                          const suggestedInput = userInput[id]?.value || '';
                          const isApproved = userInput[id]?.approved || false;
                          const isSaved = suggestedInput === record[colName];
                          if (colName === targetColumn) {
                            return (isApproved && isSaved) ? GREEN : RED;
                          }
                          return BLACK;
                        };
                        return (
                          <StaticSheetCell
                            key={`cell-${columnName}-${record.rowNumber}`}
                            value={record[columnName]}
                            color={getTextColor(columnName)}
                          />
                        );
                      })}
                    </TableRow>
                  ))}
                </SheetBody>
              </SheetTable>
            </Box>
          </Collapse>
        </SheetCell>
      </TableRow>
    </>
  );
};

CollapsibleTableRow.propTypes = {
  rowData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    column: PropTypes.string.isRequired,
    value: PropTypes.oneOfType(
      [PropTypes.string, PropTypes.number, PropTypes.bool],
    ).isRequired,
    repairSuggestion: PropTypes.oneOfType(
      [PropTypes.string, PropTypes.number, PropTypes.bool],
    ),
    rows: PropTypes.arrayOf(PropTypes.number).isRequired,
    records: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
  }).isRequired,
  schema: PropTypes.oneOfType([PropTypes.object]).isRequired,
  userInput: PropTypes.shape({
    column: PropTypes.string,
    value: PropTypes.string,
    rows: PropTypes.arrayOf(PropTypes.number),
    approved: PropTypes.bool,
  }),
  inputRef: PropTypes.oneOfType([PropTypes.object]),
  updateUserInput: PropTypes.func.isRequired,
};

CollapsibleTableRow.defaultProps = {
  inputRef: undefined,
  userInput: undefined,
};

export default CollapsibleTableRow;
