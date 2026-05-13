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
  margin-bottom: 50px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 720px;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 55px 18px 22px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: 0.2s ease;
  &:focus {
    outline: none;
    border-color: #e50914;
    box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.12);
  }
  &::placeholder {
    color: #777;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #999;
  font-size: 1.1rem;
  transition: 0.2s ease;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;
