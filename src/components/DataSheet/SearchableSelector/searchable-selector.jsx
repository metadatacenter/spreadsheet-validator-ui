import { Autocomplete, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { WHITE } from '../../../constants/Color';

// eslint-disable-next-line max-len
const SearchableSelector = ({ placeholder, value, options, onChange, onKeyPress, onHighlightChange, colorOnEmpty, startAdornment, endAdornment }) => (
  <Autocomplete
    value={value}
    forcePopupIcon={false}
    autoHighlight
    options={options}
    onChange={onChange}
    onKeyPress={onKeyPress}
    onHighlightChange={onHighlightChange}
    sx={{ backgroundColor: value === '' ? colorOnEmpty : WHITE }}
    isOptionEqualToValue={(option, input) => option === input}
    renderInput={(params) => (
      <TextField
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...params}
        fullWidth
        size="small"
        disableunderline="true"
        placeholder={placeholder}
        InputProps={{
          ...params.InputProps,
          startAdornment,
          endAdornment,
          style: {
            paddingRight: '10px',
          },
        }}
      />
    )}
    noOptionsText="Please email help@ hubmapconsortium.org to propose a new categorical value."
  />
);

SearchableSelector.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object]),
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onHighlightChange: PropTypes.func,
  colorOnEmpty: PropTypes.string,
  startAdornment: PropTypes.element,
  endAdornment: PropTypes.element,
};

SearchableSelector.defaultProps = {
  placeholder: undefined,
  value: undefined,
  onChange: undefined,
  onKeyPress: undefined,
  onHighlightChange: undefined,
  colorOnEmpty: WHITE,
  startAdornment: undefined,
  endAdornment: undefined,
};

export default SearchableSelector;
