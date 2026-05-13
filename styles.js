import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    background: #141414;
    color: white;
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
    min-height: 100vh;
    line-height: 1.5;
    overflow-x: hidden;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  button,
  input,
  select,
  textarea {
    font: inherit;
  }
  img {
    display: block;
    max-width: 100%;
  }
  ::selection {
    background: #e50914;
    color: white;
  }
`;
