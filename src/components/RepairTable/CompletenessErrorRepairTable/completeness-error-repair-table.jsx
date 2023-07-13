/* eslint-disable react/jsx-one-expression-per-line */
import { useContext, useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { useNavigate } from 'react-router-dom';
import { Stack, TableRow, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useHotkeys } from 'react-hotkeys-hook';
import AppContext from '../../../pages/AppContext';
import SheetHeader from '../../DataSheet/SheetHeader';
import SheetBody from '../../DataSheet/SheetBody';
import SheetPagination from '../../DataSheet/SheetPagination';
import Flex from '../../../styles/Panel';
import Container from '../../../styles/Container';
import { createAddOperationPatch, getPagedData } from '../../../helpers/app-utils';
import { moveItemToFront } from '../../../helpers/array-utils';
import { nullOnEmpty } from '../../../helpers/string-utils';
import { getRows, getColumnLabel, getColumnType, getPermissibleValues, getColumnDescription, getColumnName, isColumnRequired, getValueExample } from '../../../helpers/data-utils';
import HeaderWithBatchInput from '../header-with-batch-input';
import HeaderWithFilter from '../header-with-filter';
import HtmlTooltip from '../html-tooltip';
import EditableSheetCell from '../editable-sheet-cell';
import StaticSheetCell from '../static-sheet-cell';
import { ButtonPanel, CancelButton, DataSheetCard, FooterPanel, SaveAndRepairNextButton, SaveButton, SheetTable, SheetTableContainer } from '../styled';
import { getFilteredData, initUserInput } from './function';
import { COMPLETENESS_ERROR_PATH } from '../../../constants/Router';

const CompletenessErrorRepairTable = ({ targetColumn, tableData }) => {
  const navigate = useNavigate();
  const { appData, patches, updatePatches } = useContext(AppContext);
  const { schema, paths } = appData;

  const [userInput, updateUserInput] = useImmer({});
  const [batchInput, setBatchInput] = useState('');
  const [staleBatch, setStaleBatch] = useState(false);
  const [columnFilters, updateColumnFilters] = useImmer([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(
    () => {
      const existingUserInput = initUserInput(tableData, targetColumn, patches);
      updateUserInput(existingUserInput);
    },
    [targetColumn],
  );

  const filteredData = useMemo(
    () => getFilteredData(tableData, columnFilters),
    [tableData, columnFilters],
  );

  const pagedData = useMemo(
    () => getPagedData(filteredData, page, rowsPerPage),
    [filteredData, page, rowsPerPage],
  );

  const columnOrder = useMemo(
    () => moveItemToFront(targetColumn, schema.columnOrder),
    [targetColumn],
  );

  useEffect(
    () => {
      if (batchInput !== '' && !staleBatch) {
        const rows = getRows(filteredData);
        updateUserInput((prevUserInput) => {
          // eslint-disable-next-line no-param-reassign
          rows.forEach((row) => { prevUserInput[row] = batchInput; });
        });
      }
      // When staleBatch is true, it will prevent this effect hook
      // to update the field value with the batch input because it
      // may not be the final string (e.g., user is still typing or
      // the string is not one of the permissible values to enter).
      return () => setStaleBatch(true);
    },
    [filteredData, batchInput, staleBatch],
  );

  const handleSaveChanges = () => {
    tableData.forEach((record) => {
      const { rowNumber } = record;
      const value = userInput[rowNumber];
      if (value !== null) {
        const patch = createAddOperationPatch(rowNumber, targetColumn, value);
        updatePatches((existingPatches) => {
          // eslint-disable-next-line no-param-reassign
          existingPatches[rowNumber][targetColumn] = patch;
        });
      } else {
        updatePatches((existingPatches) => {
          // eslint-disable-next-line no-param-reassign
          delete existingPatches[rowNumber][targetColumn];
        });
      }
    });
    enqueueSnackbar('Changes are saved!', { variant: 'success' });
  };

  const getNextRepair = () => {
    const locations = paths.completenessErrorLocations;
    const index = locations.indexOf(targetColumn);
    const nextIndex = (index + 1 === locations.length) ? 0 : index + 1;
    return locations[nextIndex];
  };

  const saveChangesHotKeys = useHotkeys(
    ['ctrl+s', 'meta+s'],
    () => handleSaveChanges(),
    {
      preventDefault: true,
      enableOnFormTags: true,
    },
    [userInput],
  );

  return (
    <Container>
      <DataSheetCard>
        <SheetTableContainer>
          <SheetTable stickyHeader>
            <SheetHeader>
              {columnOrder.map((column, index) => {
                let component;
                if (index === 0) {
                  component = (
                    <HeaderWithBatchInput
                      key={`header-with-batch-input-on-${column}-to-repair-${targetColumn}`}
                      label={getColumnLabel(column, schema)}
                      description={getColumnDescription(column, schema)}
                      example={getValueExample(column, schema)}
                      required={isColumnRequired(column, schema)}
                      type={getColumnType(column, schema)}
                      permissibleValues={getPermissibleValues(column, schema)}
                      setBatchInput={setBatchInput}
                      setStaleBatch={setStaleBatch}
                    />
                  );
                } else {
                  component = (
                    <HeaderWithFilter
                      key={`header-with-filter-on-${column}-to-repair-${targetColumn}`}
                      name={getColumnName(column, schema)}
                      label={getColumnLabel(column, schema)}
                      description={getColumnDescription(column, schema)}
                      example={getValueExample(column, schema)}
                      required={isColumnRequired(column, schema)}
                      updateColumnFilters={updateColumnFilters}
                      setStaleBatch={setStaleBatch}
                    />
                  );
                }
                return component;
              })}
            </SheetHeader>
            <SheetBody>
              {pagedData.map((record) => {
                const row = record.rowNumber;
                return (
                  <TableRow key={`table-row-on-${row}-to-repair-${targetColumn}`}>
                    {columnOrder.map((column, index) => {
                      let component;
                      if (index === 0) {
                        component = (
                          <EditableSheetCell
                            sticky
                            key={`sheet-cell-on-${column}-${row}-to-repair-${targetColumn}`}
                            value={userInput[row] || ''}
                            type={getColumnType(column, schema)}
                            permissibleValues={getPermissibleValues(column, schema)}
                            inputRef={saveChangesHotKeys}
                            onSave={(userValue) => {
                              updateUserInput((currentUserInput) => {
                                // eslint-disable-next-line no-param-reassign
                                currentUserInput[row] = nullOnEmpty(userValue);
                              });
                            }}
                          />
                        );
                      } else {
                        component = (
                          <StaticSheetCell
                            key={`sheet-cell-on-${column}-${row}-to-repair-${targetColumn}`}
                            value={record[column]}
                          />
                        );
                      }
                      return component;
                    })}
                  </TableRow>
                );
              })}
            </SheetBody>
          </SheetTable>
        </SheetTableContainer>
        <FooterPanel>
          <Flex sx={{ width: '400px', paddingLeft: '5px' }}>
            <Stack direction="row" gap={1}>
              <HtmlTooltip
                title={(
                  <>
                    <p><b>Q: How to repair my metadata?</b></p>
                    <p>
                      A: The table displays a portion of your metadata spreadsheet where errors
                      are found. You can repair your metadata by typing the correct values
                      in the first column. You can also use the dropdown list to select a value.
                    </p>
                    <p><b>Q: What to do if the dropdown list does not have my value?</b></p>
                    <p>
                      A: Please send a new value request
                      to <em>help@hubmapconsortium.org</em> or&nbsp;
                      <a
                        href="mailto:help@hubmapconsortium.org"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        click here
                      </a>. Mention the field name and the new value(s) in your request email.
                    </p>
                  </>
                )}
                placement="right"
                arrow
              >
                <HelpIcon color="primary" fontSize="medium" />
              </HtmlTooltip>
              <Typography>Help</Typography>
            </Stack>
          </Flex>
          <SheetPagination
            data={filteredData}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </FooterPanel>
      </DataSheetCard>
      <ButtonPanel>
        <CancelButton
          variant="outlined"
          onClick={() => navigate(`../${COMPLETENESS_ERROR_PATH}`)}
        >
          Back to Overview
        </CancelButton>
        <SaveButton
          variant="contained"
          onClick={handleSaveChanges}
        >
          Save
        </SaveButton>
        <SaveAndRepairNextButton
          variant="contained"
          onClick={() => {
            handleSaveChanges();
            navigate(`../${COMPLETENESS_ERROR_PATH}/${getNextRepair()}`);
          }}
        >
          Save and Repair Next
        </SaveAndRepairNextButton>
      </ButtonPanel>
    </Container>
  );
};

CompletenessErrorRepairTable.propTypes = {
  targetColumn: PropTypes.string.isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object]),
  ).isRequired,
};

export default CompletenessErrorRepairTable;
