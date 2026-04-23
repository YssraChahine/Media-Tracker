import { useState } from "react";
import { searchMedia } from "@/utils/tmdb";
import SearchBar from "@/components/SearchBar";
import styled from "styled-components";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function HomePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const {data: media =[], mutate} = useSWR("/api/media", fetcher);
  const addedIds = media.map((item) => Number(item.apiId));

  async function handleSearch(query) {
    if (!query) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const data = await searchMedia(query);
      const filtered = data.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      setResults(filtered);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }
  async function handleAdd(item) {
    try {
      const response = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiId: item.id.toString(),
          title: item.title || item.name,
          type: item.media_type === "tv" ? "series" : "movie",
          imageUrl: item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      } mutate();
    } catch (error) {
      console.error(error);
      alert("Error saving media");
    }
  }

  return (
    <Main>
      <Heading>Media Tracker</Heading>

      <Link href="/media">
        <ViewButton>My List</ViewButton>
      </Link>

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

              <AddButton
                onClick={() => handleAdd(item)}
                disabled={addedIds.includes(item.id)}
              >
                {addedIds.includes(item.id) ? "Added" : "+ Add"}
              </AddButton>
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
  margin-bottom: 20px;
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

const AddButton = styled.button`
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  font-size: 0.8rem;
  transition: all 0.15s ease;
  background: ${({ disabled }) => (disabled ? "#ccc" : "black")};
  color: ${({ disabled }) => (disabled ? "#666" : "white")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  &:hover {
    background: ${({ disabled }) => (disabled ? "#ccc" : "#333")};
  }
`;

const ViewButton = styled.button`
  display: block;
  margin: 0 auto 20px;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #0070f3;
  color: white;
  cursor: pointer;
  &:hover {
    background: #0059c1;
  }
`;
