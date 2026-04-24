import { useState } from "react";
import { searchMedia } from "@/utils/tmdb";
import SearchBar from "@/components/SearchBar";
import styled from "styled-components";
import Link from "next/link";
import useSWR from "swr";
import MediaCard from "@/components/MediaCard";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function HomePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: media = [], mutate } = useSWR("/api/media", fetcher);

  const {
    data: featured = [],
    isLoading: featuredLoading,
    error: featuredError,
  } = useSWR("/api/featured", fetcher);

  const addedIds = media.map((item) => Number(item.apiId));

  async function handleSearch(query) {
    setHasSearched(!!query);

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
      }
      mutate();
    } catch (error) {
      console.error(error);
      alert("Error saving media");
    }
  }

  return (
    <Main>
      <Heading>Media Tracker</Heading>

      <Link href="/media">
        <ViewButton>View My List</ViewButton>
      </Link>

      <SearchBar onSearch={handleSearch} />

      {loading && <Message>Searching...</Message>}

      {!hasSearched && featuredLoading && (
        <Message>Loading popular media...</Message>
      )}

      {featuredError && <Message>Error loading content.</Message>}

      {!loading && hasSearched && results.length === 0 && (
        <Message>No results found</Message>
      )}

      {results.length > 0 && (
        <Grid>
          {results.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onAdd={handleAdd}
              isAdded={addedIds.includes(item.id)}
            />
          ))}
        </Grid>
      )}
      {!hasSearched && !featuredLoading && (
        <>
          <SubHeading>Popular right now</SubHeading>
          <Grid>
            {featured.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onAdd={handleAdd}
                isAdded={addedIds.includes(item.id)}
              />
            ))}
          </Grid>
        </>
      )}
    </Main>
  );
}

const Main = styled.main`
  max-width: 900px;
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
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

const SubHeading = styled.h2`
  text-align: center;
  font-size: 1rem;
  margin-bottom: 20px;
  color: #666;
`;
