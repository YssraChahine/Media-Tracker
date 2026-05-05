import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #141414;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`;
