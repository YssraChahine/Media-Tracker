import useSWR from "swr";
import styled from "styled-components";
import { useState } from "react";
import BackButton from "@/components/BackButton";
import MediaList from "@/components/MediaList";
import Filter from "@/components/Filter";
import Insights from "@/components/Insights";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function MediaPage() {
  const {
    data: media = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/media", fetcher);

  const [search, setSearch] = useState("");

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

  const filteredMedia = Array.isArray(media)
    ? media.filter((item) => {
        const matchesStatus =
          filters.status === "all" || item.status === filters.status;

        const matchesFavorites = !filters.favorites || item.isFavorite;

        const matchesSearch = item.title
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesStatus && matchesFavorites && matchesSearch;
      })
    : [];

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
      <GradientGlow />

      <HeroSection>
        <TopBar>
          <BackButton />
        </TopBar>

        <Heading>My Collection</Heading>

        <SubText>
          Organize your favorite movies and series in one cinematic space.
        </SubText>

        <Insights media={media} />
      </HeroSection>

      <ContentWrapper>
        <SearchWrapper>
          <SearchInput
            type="text"
            placeholder="Search in your collection..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </SearchWrapper>

        <Panel>
          <Filter filters={filters} setFilters={setFilters} />

          <CollectionHeader>
            <CollectionTitle>{filteredMedia.length} Titles</CollectionTitle>

            <CollectionSubtitle>
              Your personal watch collection
            </CollectionSubtitle>
          </CollectionHeader>

          {filteredMedia.length === 0 && search && (
            <EmptyState>
              <h3>No results found</h3>
              <p>Try another search.</p>
            </EmptyState>
          )}

          {Array.isArray(media) && media.length === 0 && (
            <EmptyState>
              <h3>No media added yet</h3>
              <p>Start adding movies and series to build your collection.</p>
            </EmptyState>
          )}

          <MediaList
            media={filteredMedia}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            mutate={mutate}
          />
        </Panel>
      </ContentWrapper>
    </Main>
  );
}

const Main = styled.main`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: #0a0a0a;
  color: white;
  padding: 40px 24px 100px;
`;

const GradientGlow = styled.div`
  position: absolute;
  top: -250px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 900px;
  border-radius: 50%;
  background: rgba(229, 9, 20, 0.12);
  filter: blur(140px);
  pointer-events: none;
`;

const HeroSection = styled.section`
  position: relative;
  z-index: 2;
  max-width: 1500px;
  margin: 0 auto 50px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const Heading = styled.h1`
  text-align: center;
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -3px;
  margin-bottom: 18px;
  background: linear-gradient(to bottom, #ffffff, #8d8d8d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubText = styled.p`
  text-align: center;
  color: #9a9a9a;
  font-size: 1.1rem;
  max-width: 650px;
  margin: 0 auto 50px;
  line-height: 1.7;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1500px;
  margin: 0 auto;
`;

const Panel = styled.section`
  position: relative;
  margin-top: 30px;
  padding: 40px;
  border-radius: 36px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 26px;
  }
`;

const CollectionHeader = styled.div`
  margin: 20px 0 35px;
`;

const CollectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -1px;
`;

const CollectionSubtitle = styled.p`
  margin-top: 6px;
  color: #8b8b8b;
`;

const Message = styled.p`
  text-align: center;
  color: #888;
  margin-top: 40px;
`;

const EmptyState = styled.div`
  text-align: center;
  margin: 70px 0;
  padding: 50px 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  h3 {
    font-size: 1.6rem;
    margin-bottom: 10px;
  }
  p {
    color: #8a8a8a;
    font-size: 1rem;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 35px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 760px;
  padding: 20px 26px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  backdrop-filter: blur(14px);
  color: white;
  font-size: 1rem;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
  &::placeholder {
    color: #7d7d7d;
  }
  &:focus {
    outline: none;
    transform: translateY(-2px);
    border-color: rgba(229, 9, 20, 0.45);
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.05)
    );
  }
`;
