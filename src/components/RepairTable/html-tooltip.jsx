import { styled, Tooltip, tooltipClasses } from '@mui/material';

const HtmlTooltip = styled(({ className, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 650,
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}));

export default HtmlTooltip;
