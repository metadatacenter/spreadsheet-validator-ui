import { FormControl } from '@mui/material';
import PropTypes from 'prop-types';
import SheetCell from '../DataSheet/SheetCell';
import InputField from '../DataSheet/InputField';
import SearchableSelector from '../DataSheet/SearchableSelector';
import { LIGHT_RED } from '../../constants/Color';
import { DATE, EMAIL, NUMBER, PHONE, STRING, TIME } from '../../constants/ValueType';

// eslint-disable-next-line max-len
const EditableSheetCell = ({ value, type, permissibleValues, sticky, inputRef, onSave, highlightEmpty }) => (
  <SheetCell sx={{ zIndex: sticky ? 998 : 0 }} sticky={sticky}>
    <FormControl fullWidth>
      {permissibleValues && permissibleValues.length > 0
        ? (
          <SearchableSelector
            value={value}
            options={permissibleValues}
            onChange={(event, newValue) => {
              onSave(newValue);
            }}
            colorOnEmpty={highlightEmpty ? LIGHT_RED : ''}
          />
        )
        : (
          <InputField
            value={value}
            type={type}
            inputRef={inputRef}
            onChange={(event) => {
              const newValue = event.target.value;
              onSave(newValue);
            }}
            colorOnEmpty={highlightEmpty ? LIGHT_RED : ''}
          />
        )}
    </FormControl>
  </SheetCell>
);

EditableSheetCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
  type: PropTypes.oneOf([STRING, NUMBER, DATE, TIME, EMAIL, URL, PHONE]),
  permissibleValues: PropTypes.arrayOf(PropTypes.string),
  sticky: PropTypes.bool,
  inputRef: PropTypes.oneOfType([PropTypes.object]),
  onSave: PropTypes.func.isRequired,
  highlightEmpty: PropTypes.bool,
};

EditableSheetCell.defaultProps = {
  type: STRING,
  permissibleValues: undefined,
  inputRef: undefined,
  sticky: false,
  highlightEmpty: true,
};

export default EditableSheetCell;
