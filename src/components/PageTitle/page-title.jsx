import { styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { DARK_GRAY } from '../../constants/Color';

const Title = styled(Typography)({
  fontSize: '27pt',
  fontWeight: 'bold',
  lineHeight: '50px',
});

const SubTitle = styled(Typography)({
  fontSize: '15pt',
});

const PageTitle = ({ title, subtitle }) => (
  <>
    <Title variant="h3">{title}</Title>
    <SubTitle variant="h4" sx={{ display: 'flex', color: DARK_GRAY }}>
      {subtitle}
    </SubTitle>
  </>
);

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default PageTitle;
