import useSWR from "swr";
import styled from "styled-components";
import BackButton from "@/components/BackButton";
import MediaList from "@/components/MediaList";
import Filter from "@/components/Filter";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function MediaPage() {
  const {
    data: media = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/media", fetcher);

  const [filters, setFilters] = useState({
    status: "all",
    favorites: false,
  });

  async function handleToggleFavorite(id, currentState) {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFavorite: !currentState,
        }),
      });
      if (!response.ok) {
        throw new Error("Favorite update failed");
      }
      mutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      mutate();
    } catch (error) {
      console.error(error);
    }
  }

  const filteredMedia = media.filter((item) => {
    const matchesStatus =
      filters.status === "all" || item.status === filters.status;
    const matchesFavorites = !filters.favorites || item.isFavorite;
    return matchesStatus && matchesFavorites;
  });

  if (isLoading) {
    return (
      <Main>
        <BackButton />
        <Message>Loading...</Message>
      </Main>
    );
  }
  if (error) {
    return (
      <Main>
        <BackButton />
        <Message>Error loading media.</Message>
      </Main>
    );
  }

  return (
    <Main>
      <TopBar>
        <BackButton />
      </TopBar>

      <Heading>My Collection</Heading>
      <SubText>Track your movies & series</SubText>
      <Filter filters={filters} setFilters={setFilters} />
      {filteredMedia.length === 0 && (
        <EmptyState>
          <h3>No matching media</h3>
          <p>Try adjusting your filters.</p>
        </EmptyState>
      )}
      {media.length === 0 && (
        <EmptyState>
          <h3>No media added yet</h3>
          <p>Start adding movies and series to your collection.</p>
        </EmptyState>
      )}

      <MediaList
        media={filteredMedia}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        mutate={mutate}
      />
    </Main>
  );
}

const Main = styled.main`
  max-width: 1000px;
  margin: 50px auto;
  padding: 20px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 2.3rem;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
`;

const SubText = styled.p`
  text-align: center;
  color: #777;
  margin-bottom: 25px;
  font-size: 0.9rem;
`;

const Message = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.95rem;
`;

const EmptyState = styled.div`
  text-align: center;
  margin-top: 60px;
  color: #777;
  h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
  }
  p {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;
