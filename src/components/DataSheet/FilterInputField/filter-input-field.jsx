import { OutlinedInput } from '@mui/material';
import PropTypes from 'prop-types';
import { WHITE } from '../../../constants/Color';
import { DATE, EMAIL, NUMBER, PHONE, STRING, TIME, URL } from '../../../constants/ValueType';

const FilterInputField = ({ id, type, onChange, endAdornment }) => (
  <OutlinedInput
    fullWidth
    multiline={type !== NUMBER}
    key={id}
    type={type}
    size="small"
    placeholder="Filter..."
    onChange={onChange}
    endAdornment={endAdornment}
    sx={{ minWidth: '150px', backgroundColor: WHITE }}
  />
);

FilterInputField.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf([STRING, NUMBER, DATE, TIME, EMAIL, URL, PHONE]).isRequired,
  onChange: PropTypes.func,
  endAdornment: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.element]),
};

FilterInputField.defaultProps = {
  id: undefined,
  onChange: undefined,
  endAdornment: undefined,
};

export default FilterInputField;
