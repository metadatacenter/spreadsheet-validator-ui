import { OutlinedInput } from '@mui/material';
import PropTypes from 'prop-types';
import { DATE, EMAIL, NUMBER, PHONE, STRING, TIME, URL } from '../../../constants/ValueType';
import { WHITE } from '../../../constants/Color';

const InputField = (
  // eslint-disable-next-line max-len
  { id, value, type, placeholder, required, inputRef, onChange, onKeyPress, colorOnEmpty, error, endAdornment },
) => (
  <OutlinedInput
    fullWidth
    multiline={type !== NUMBER}
    key={id}
    size="small"
    value={value}
    type={type}
    placeholder={placeholder}
    required={required}
    inputRef={inputRef}
    onChange={onChange}
    onKeyPress={onKeyPress}
    sx={{ minWidth: '150px', backgroundColor: value === '' ? colorOnEmpty : WHITE }}
    error={error}
    endAdornment={endAdornment}
  />
);

InputField.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf([STRING, NUMBER, DATE, TIME, EMAIL, URL, PHONE]).isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  inputRef: PropTypes.oneOfType([PropTypes.object]),
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  colorOnEmpty: PropTypes.string,
  error: PropTypes.bool,
  endAdornment: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.element]),
};

InputField.defaultProps = {
  id: undefined,
  value: undefined,
  placeholder: undefined,
  required: false,
  inputRef: undefined,
  onChange: undefined,
  onKeyPress: undefined,
  colorOnEmpty: WHITE,
  error: false,
  endAdornment: undefined,
};

export default InputField;
