import { useState } from 'react';
import { FormControl, InputAdornment, IconButton, Box } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';
import InputField from '../DataSheet/InputField';
import SearchableSelector from '../DataSheet/SearchableSelector';
import InfoTooltip from './info-tooltip';
import { HeaderCell, HeaderLabel } from './styled';
import { DATE, EMAIL, NUMBER, PHONE, STRING, TIME } from '../../constants/ValueType';
import { DARK_GRAY, RED } from '../../constants/Color';
import gaEvents from '../../events';

// eslint-disable-next-line max-len
const HeaderWithBatchInput = ({ id, label, description, example, required, type, permissibleValues, setBatchInput, setStaleBatch }) => {
  const [value, setValue] = useState('');
  const handleSelectionChange = (event, input) => {
    setValue(input);
    event.preventDefault();
  };
  const handleHighlightChange = (event, option, reason) => {
    if (option && reason === 'keyboard') {
      setValue(option);
    }
    event.preventDefault();
  };
  const handleInputChange = (event) => {
    setValue(event.target.value);
    event.preventDefault();
  };
  const handleBatchIconClick = (event) => {
    setBatchInput(value);
    setStaleBatch(false);
    event.preventDefault();
    gaEvents.useBatchFillout();
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setBatchInput(value);
      setStaleBatch(false);
      event.preventDefault();
      gaEvents.useBatchFillout();
    }
  };
  return (
    <HeaderCell sx={{ minWidth: '220px' }} sticky>
      <Box sx={{ display: 'flex', alignItems: 'end' }}>
        <HeaderLabel>
          {label}
          {required ? <span style={{ color: RED }}>*</span> : ''}
        </HeaderLabel>
        <InfoTooltip title={description}>
          <HelpOutlineIcon fontSize="small" sx={{ color: DARK_GRAY, paddingLeft: '5px', paddingBottom: '13px' }} />
        </InfoTooltip>
        {example && (
          <InfoTooltip title={`Example: ${example}`}>
            <InfoOutlinedIcon fontSize="small" sx={{ color: DARK_GRAY, paddingLeft: '5px', paddingBottom: '13px' }} />
          </InfoTooltip>
        )}
      </Box>
      <FormControl fullWidth>
        {permissibleValues && permissibleValues.length > 0
          ? (
            <SearchableSelector
              key={`${id}-searchable-selector`}
              placeholder="Enter batch value..."
              value={value}
              options={permissibleValues}
              onChange={handleSelectionChange}
              onKeyPress={handleKeyPress}
              onHiglightChange={handleHighlightChange}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleBatchIconClick}>
                    <KeyboardReturnIcon />
                  </IconButton>
                </InputAdornment>
              )}
            />
          )
          : (
            <InputField
              key={`${id}-input-field`}
              type={type}
              placeholder="Enter batch value..."
              value={value}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleBatchIconClick}>
                    <KeyboardReturnIcon />
                  </IconButton>
                </InputAdornment>
              )}
            />
          )}
      </FormControl>
    </HeaderCell>
  );
};

HeaderWithBatchInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf([STRING, NUMBER, DATE, TIME, EMAIL, URL, PHONE]),
  description: PropTypes.string,
  example: PropTypes.string,
  required: PropTypes.bool,
  permissibleValues: PropTypes.arrayOf(PropTypes.string),
  setBatchInput: PropTypes.func.isRequired,
  setStaleBatch: PropTypes.func.isRequired,
};

HeaderWithBatchInput.defaultProps = {
  id: undefined,
  type: STRING,
  description: undefined,
  example: undefined,
  required: false,
  permissibleValues: undefined,
};

export default HeaderWithBatchInput;
