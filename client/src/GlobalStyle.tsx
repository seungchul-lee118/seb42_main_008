import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'IBM Plex Sans KR', sans-serif;
  }

  html, body, #root {
    width: 100%;
  }

ol,ul{
  list-style: none;
}
 a {
  text-decoration: none;
  color: black;
}


 main {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

`;
export default GlobalStyle;
