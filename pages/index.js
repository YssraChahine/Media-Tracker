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
  async function handleToggle(item) {
    try {
      const existing = media.find((media) => Number(media.apiId) === item.id);
      if (!existing) {
        const response = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiId: item.id.toString(),
            title: item.title || item.name,
            type: item.media_type === "tv" ? "series" : "movie",
            imageUrl: item.poster_path
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : "",
          }),
        });
        if (!response.ok) throw new Error("Add failed");
      } else {
        const RemoveResponse = await fetch(`/api/media/${existing._id}`, {
          method: "DELETE",
        });
        if (!RemoveResponse.ok) throw new Error("Delete failed");
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
              onToggle={handleToggle}
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
                onToggle={handleToggle}
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
  margin-bottom: 30px;
  font-size: 2.2rem;
  letter-spacing: -1px;
`;

const Message = styled.p`
  text-align: center;
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 28px;
`;

const ViewButton = styled.button`
  display: block;
  margin: 0 auto 30px;
  padding: 12px 20px;
  border-radius: 999px;
  border: none;
  background: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #222;
    transform: translateY(-2px);
  }
`;

const SubHeading = styled.h2`
  text-align: center;
  font-size: 1rem;
  margin-bottom: 20px;
  color: #666;
`;
