import { useState, useEffect } from 'react';
import { Typography, FormControl, InputAdornment, IconButton, Tooltip, CircularProgress, Box } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import PropTypes from 'prop-types';
import InputField from '../DataSheet/InputField';
import SearchableSelector from '../DataSheet/SearchableSelector';
import InfoTooltip from './info-tooltip';
import { HeaderCell, HeaderLabel } from './styled';
import { DATE, EMAIL, NUMBER, PHONE, STRING, TIME, URL } from '../../constants/ValueType';
import { DARK_GRAY, RED } from '../../constants/Color';

// eslint-disable-next-line max-len
const HeaderWithBatchInput = ({ id, label, description, example, required, type, inputPattern, permissibleValues, setBatchInput, setStaleBatch }) => {
  const [value, setValue] = useState('');
  const [valid, setValid] = useState(true);
  const [adornment, setAdornment] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);

  useEffect(() => setValue(value), [value]);

  const showKeyboardEnterIcon = () => {
    const handleBatchIconClick = (event) => {
      if (valid) {
        setBatchInput(value);
        setStaleBatch(false);
      }
      event.preventDefault();
    };
    return (
      <InputAdornment position="end">
        <IconButton edge="end" onClick={handleBatchIconClick}>
          <KeyboardReturnIcon />
        </IconButton>
      </InputAdornment>
    );
  };

  const showCircularProgress = () => (
    <InputAdornment position="end">
      <CircularProgress size={20} />
    </InputAdornment>
  );

  const showErrorIcon = (message) => (
    <InputAdornment position="end">
      <Tooltip title={<Typography fontSize={15}>{message}</Typography>}>
        <ErrorIcon color="error" />
      </Tooltip>
    </InputAdornment>
  );

  const showCheckIcon = (message) => (
    <InputAdornment position="end">
      <Tooltip title={<Typography fontSize={15}>{message}</Typography>}>
        <CheckIcon color="primary" />
      </Tooltip>
    </InputAdornment>
  );

  const showOpenLinkIcon = (url, message) => (
    <InputAdornment position="end">
      <Tooltip title={<Typography fontSize={15}>{message}</Typography>}>
        <IconButton onClick={() => window.open(url, '_blank')}>
          <CheckIcon color="primary" />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );

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
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (valid) {
        setBatchInput(value);
        setStaleBatch(false);
      }
      event.preventDefault();
    }
  };

  const handleUrlCheck = (userInput) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(userInput)) {
      fetch('/service/url-checker', {
        method: 'POST',
        body: userInput,
        headers: { 'Content-Type': 'text/plain' },
      })
        .then((response) => response.json())
        .then((answer) => {
          if (answer.isReachable) {
            setValid(true);
            setAdornment(showOpenLinkIcon(userInput, 'Click to open page'));
          } else {
            setValid(false);
            setAdornment(showErrorIcon('URL does not exist'));
          }
        });
    } else {
      setValid(false);
      setAdornment(showErrorIcon('URL is not valid'));
    }
  };

  const handleStringPatternCheck = (userInput) => {
    const regex = new RegExp(inputPattern);
    if (regex.test(userInput)) {
      setValid(true);
      setAdornment(showCheckIcon('Input matches pattern'));
    } else {
      setValid(false);
      setAdornment(showErrorIcon('Input does not match pattern'));
    }
  };

  const handleValidation = (userInput) => {
    if (type === URL) {
      if (typingTimeout) {
        setAdornment(showCircularProgress());
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(setTimeout(() => handleUrlCheck(userInput), 1000));
    } else if (type === STRING) {
      if (inputPattern) {
        if (typingTimeout) {
          setAdornment(showCircularProgress());
          clearTimeout(typingTimeout);
        }
        setTypingTimeout(setTimeout(() => handleStringPatternCheck(userInput), 1000));
      } else {
        setValid(true);
        setAdornment(null);
      }
    } else {
      setValid(true);
      setAdornment(null);
    }
  };

  const handleInputChange = (event) => {
    const userInput = event.target.value;
    setValue(userInput);
    handleValidation(userInput);
    event.preventDefault();
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
              endAdornment={showKeyboardEnterIcon()}
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
              endAdornment={adornment || showKeyboardEnterIcon()}
              error={!valid}
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
  inputPattern: PropTypes.string,
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
  inputPattern: undefined,
  permissibleValues: undefined,
};

export default HeaderWithBatchInput;
