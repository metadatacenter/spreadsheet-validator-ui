import Container from '../../styles/Container';
import Block from '../../styles/Block';
import { WHITE } from '../../constants/Color';

const PageFooter = () => (
  <Container
    sx={{
      backgroundColor: WHITE,
      minHeight: '12vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Block>
      <a href="https://metadatacenter.org/" target="_blank" rel="noreferrer">
        <img
          src="https://metadatacenter.org/wp-content/uploads/2019/03/CEDAR_logo_tree_no_line-3-80x80.png"
          alt="CEDAR logo"
          width="70px"
        />
      </a>
    </Block>
    <Block sx={{ width: '38%', textAlign: 'center' }}>
      Copyright © 2023-2025 The Board of Trustees of Leland Stanford Junior University
    </Block>
    <Block>
      <a href="https://github.com/metadatacenter/spreadsheet-validator-ui" target="_blank" rel="noreferrer">
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub logo"
          width="60px"
        />
      </a>
    </Block>
  </Container>
);

export default PageFooter;
