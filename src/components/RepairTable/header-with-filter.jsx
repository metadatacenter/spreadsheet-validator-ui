import { useState } from 'react';
import { IconButton, InputAdornment, Box } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';
import FilterInputField from '../DataSheet/FilterInputField';
import InfoTooltip from './info-tooltip';
import { HeaderCell, HeaderLabel } from './styled';
import { DARK_GRAY, RED } from '../../constants/Color';

// eslint-disable-next-line max-len
const HeaderWithFilter = ({ id, name, label, description, example, required, updateColumnFilters, setStaleBatch }) => {
  const [filterEnabled, setFilterEnabled] = useState(true);
  const handleFilterChange = (event) => {
    const enteredValue = event.target.value;
    updateColumnFilters((currentFilters) => {
      const foundFilter = currentFilters.filter(
        (filter) => filter.column === name,
      );
      if (foundFilter.length === 0) {
        currentFilters.push({
          column: name,
          value: enteredValue,
          enabled: true,
        });
      } else if (foundFilter.length === 1) {
        const filter = foundFilter[0];
        filter.value = enteredValue;
      }
    });
    setStaleBatch(true);
    event.preventDefault();
  };
  const handleFilterIconClick = (event) => {
    setFilterEnabled(!filterEnabled);
    updateColumnFilters((currentFilters) => {
      const foundFilter = currentFilters.filter(
        (filter) => filter.column === name,
      );
      if (foundFilter.length === 1) {
        const filter = foundFilter[0];
        filter.enabled = !filterEnabled;
      }
    });
    setStaleBatch(true);
    event.preventDefault();
  };
  return (
    <HeaderCell>
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
      <FilterInputField
        id={`${id}-column-filter-field`}
        onChange={handleFilterChange}
        endAdornment={(
          <InputAdornment position="end">
            <IconButton edge="end" onClick={handleFilterIconClick}>
              {filterEnabled ? <FilterAltIcon /> : <FilterAltOffIcon />}
            </IconButton>
          </InputAdornment>
        )}
      />
    </HeaderCell>
  );
};

HeaderWithFilter.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  example: PropTypes.string,
  required: PropTypes.bool,
  updateColumnFilters: PropTypes.func.isRequired,
  setStaleBatch: PropTypes.func.isRequired,
};

HeaderWithFilter.defaultProps = {
  id: undefined,
  description: undefined,
  example: undefined,
  required: false,
};

export default HeaderWithFilter;
