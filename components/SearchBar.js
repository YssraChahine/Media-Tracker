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
      <InputWrapper>
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
      </InputWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 6px;
  font-size: 1rem;
  &::placeholder {
    color: #888;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;
