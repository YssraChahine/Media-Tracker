import { useState } from "react";
import styled from "styled-components";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleChange(event) {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  }

  function handleClear() {
    setQuery("");
    onSearch("");
  }

  return (
    <Wrapper>
      <Input
        type="text"
        placeholder="Search movies or series..."
        value={query}
        onChange={handleChange}
      />

      {query && (
        <ClearButton type="button" onClick={handleClear}>
          X
        </ClearButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #333;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;
