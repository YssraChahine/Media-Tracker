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
  margin-bottom: 30px;
  justify-content: center;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  padding: 4px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  transition: all 0.2s;
  &:focus-within {
    transform: scale(1.02);
    box-shadow:
      0 15px 40px rgba(0, 0, 0, 0.12),
      0 0 0 3px rgba(0, 112, 243, 0.15);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 45px 14px 18px;
  border-radius: 999px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0%.95rem;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;
