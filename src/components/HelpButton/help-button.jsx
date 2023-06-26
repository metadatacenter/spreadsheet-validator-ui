import { Fab, Link } from '@mui/material';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';

const HelpButton = () => (
  <Link
    href="https://metadatacenter.github.io/spreadsheet-validator-docs/"
    rel="noopener"
    target="_blank"
  >
    <Fab color="primary" aria-label="help" sx={{ position: 'fixed', bottom: 32, left: 45 }}>
      <HelpOutlinedIcon />
    </Fab>
  </Link>
);

export default HelpButton;
