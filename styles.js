import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif, system-ui;
    background: radial-gradient(
    circle at top,
    #f9fbff,
    #eef2f7
  );
  color: #111;
} ;

  h1, h2, h3 {
    margin: 0;
  }
  button{
    font-family: inherit;
  }
`;
