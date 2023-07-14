import { useState, useEffect } from 'react';
import { FormControl, IconButton, InputAdornment, Typography, Tooltip, CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import PropTypes from 'prop-types';
import SheetCell from '../DataSheet/SheetCell';
import InputField from '../DataSheet/InputField';
import SearchableSelector from '../DataSheet/SearchableSelector';
import { LIGHT_RED } from '../../constants/Color';
import { DATE, EMAIL, NUMBER, PHONE, STRING, TIME, URL } from '../../constants/ValueType';

const showCircularProgress = () => (
  <InputAdornment position="end">
    <CircularProgress size={20} />
  </InputAdornment>
);

const showErrorIcon = (message) => (
  <InputAdornment position="end">
    <Tooltip title={<Typography fontSize={15}>{message}</Typography>}>
      <IconButton sx={{ paddingRight: 0 }}>
        <ErrorIcon color="error" />
      </IconButton>
    </Tooltip>
  </InputAdornment>
);

const showOpenLinkIcon = (url) => (
  <InputAdornment position="end">
    <IconButton sx={{ paddingRight: 0 }}>
      <FileDownloadDoneIcon color="primary" onClick={() => window.open(url, '_blank')} />
    </IconButton>
  </InputAdornment>
);

// eslint-disable-next-line max-len
const EditableSheetCell = ({ value, type, permissibleValues, sticky, inputRef, onSave, highlightEmpty }) => {
  const [newValue, setNewValue] = useState(value);
  const [valid, setValid] = useState(true);
  const [adornment, setAdornment] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);

  useEffect(() => setNewValue(value), [value]);

  const handleUrlCheck = (userInput) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(userInput)) {
      setAdornment(showCircularProgress());
      fetch('/service/url-checker', {
        method: 'POST',
        body: userInput,
        headers: { 'Content-Type': 'text/plain' },
      })
        .then((response) => response.json())
        .then((answer) => {
          if (answer.isReachable) {
            setValid(true);
            onSave(userInput);
            setAdornment(showOpenLinkIcon(userInput));
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

  const handleValidation = (userInput) => {
    if (type === URL) {
      if (typingTimeout) {
        setAdornment(null);
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(setTimeout(() => handleUrlCheck(userInput), 1000));
    } else {
      setValid(true);
      onSave(userInput);
      setAdornment(null);
    }
  };

  return (
    <SheetCell sx={{ zIndex: sticky ? 998 : 0 }} sticky={sticky}>
      <FormControl fullWidth>
        {permissibleValues && permissibleValues.length > 0
          ? (
            <SearchableSelector
              value={newValue}
              options={permissibleValues}
              onChange={(event, userInput) => {
                setNewValue(userInput);
                onSave(userInput);
              }}
              colorOnEmpty={highlightEmpty ? LIGHT_RED : ''}
            />
          )
          : (
            <InputField
              value={newValue}
              type={type}
              inputRef={inputRef}
              onChange={(event) => {
                const userInput = event.target.value;
                setNewValue(userInput);
                handleValidation(userInput);
              }}
              error={!valid}
              colorOnEmpty={highlightEmpty ? LIGHT_RED : ''}
              endAdornment={adornment}
            />
          )}
      </FormControl>
    </SheetCell>
  );
};

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
