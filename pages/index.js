import { useState } from "react";
import { searchMedia } from "@/utils/tmdb";
import SearchBar from "@/components/SearchBar";
import styled from "styled-components";

export default function HomePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(query) {
    if (!query) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const data = await searchMedia(query);
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Main>
      <Heading>Media Tracker</Heading>

      <SearchBar onSearch={handleSearch} />

      {loading && <Message>Loading...</Message>}

      {!loading && results.length === 0 && <Message>No results found</Message>}

      <Grid>
        {results.map((item) => (
          <Card key={item.id}>
            <Poster
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                  : "/placeholder.jpg"
              }
              alt={item.title || item.name}
            />

            <Info>
              <Title>{item.title || item.name}</Title>
              <Type>{item.media_type}</Type>
            </Info>
          </Card>
        ))}
      </Grid>
    </Main>
  );
}

const Main = styled.main`
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 25px;
`;

const Message = styled.p`
  text-align: center;
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
`;

const Card = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const Poster = styled.img`
  width: 80px;
  border-radius: 6px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-weight: 600;
  margin: 0;
`;

const Type = styled.p`
  font-size: 0.8rem;
  color: #888;
`;
