import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { getOverviewTitle } from '../../../helpers/title-utils';
import { OVERVIEW_PATH } from '../../../constants/Router';
import { BLACK, WHITE } from '../../../constants/Color';

const OverviewNavMenu = () => {
  const navigate = useNavigate();
  return (
    <Button
      size="medium"
      color="inherit"
      sx={{
        textTransform: 'none',
        fontSize: '1.08em',
        marginRight: '5px',
        '&:hover': {
          color: BLACK,
          backgroundColor: WHITE,
        },
      }}
      onClick={() => {
        navigate(OVERVIEW_PATH);
      }}
    >
      {getOverviewTitle()}
    </Button>
  );
};

export default OverviewNavMenu;
