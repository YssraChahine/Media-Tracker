import { useState } from "react";
import { searchMedia } from "@/utils/tmdb";
import SearchBar from "@/components/SearchBar";
import styled from "styled-components";
import Link from "next/link";
import useSWR from "swr";
import MediaCard from "@/components/MediaCard";
import RecommendationsSection from "@/components/RecommendationsSection";
import UpcomingSection from "@/components/UpcomingSection";

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

  const { data: recommendations = [], isLoading: recommendationsLoading } =
    useSWR("/api/recommendations", fetcher);

  const { data: upcoming = [], isLoading: upcomingLoading } = useSWR(
    "/api/upcoming",
    fetcher
  );

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
      const existing = media.find((entry) => Number(entry.apiId) === item.id);
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
        const removeResponse = await fetch(`/api/media/${existing._id}`, {
          method: "DELETE",
        });
        if (!removeResponse.ok) throw new Error("Delete failed");
      }
      mutate();
    } catch (error) {
      console.error(error);
      alert("Error saving media");
    }
  }

  return (
    <Main>
      <HeroSection>
        <Overlay />

        <HeroContent>
          <HeroTitle>Unlimited movies and series.</HeroTitle>

          <HeroText>
            Track your favorite media and discover new recommendations.
          </HeroText>

          <Link href="/media">
            <ViewButton>View My List</ViewButton>
          </Link>
        </HeroContent>
      </HeroSection>

      <Content>
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
          <Section>
            <SectionTitle>Search Results</SectionTitle>
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
          </Section>
        )}
        {!hasSearched && !featuredLoading && (
          <>
            <Section>
              <SectionTitle>Popular right now</SectionTitle>
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
            </Section>
            <Section>
              {recommendationsLoading ? (
                <Message>Loading recommendations...</Message>
              ) : (
                <RecommendationsSection
                  recommendations={recommendations}
                  onToggle={handleToggle}
                  addedIds={addedIds}
                />
              )}
            </Section>
            <Section>
              {upcomingLoading ? (
                <Message>Loading upcoming releases...</Message>
              ) : (
                <UpcomingSection
                  upcoming={upcoming}
                  onToggle={handleToggle}
                  addedIds={addedIds}
                />
              )}
            </Section>
          </>
        )}
      </Content>
    </Main>
  );
}

const Main = styled.main`
  min-height: 100vh;
  background: #141414;
  color: white;
`;

const HeroSection = styled.section`
  position: relative;
  height: 70vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  padding: 40px;
  background-image: url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  @media (max-width: 768px) {
    height: 60vh;
    min-height: 500px;
    padding: 24px;
  }
`;

const Message = styled.p`
  text-align: center;
  color: #aaa;
  margin-top: 30px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const ViewButton = styled.button`
  border: none;
  background: #e50914;
  color: white;
  padding: 14px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #f40612;
    transform: scale(1.03);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(20, 20, 20, 1),
    rgba(20, 20, 20, 0.5),
    rgba(20, 20, 20, 0.3)
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 650px;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.1rem;
  color: #ddd;
  margin-bottom: 30px;
  line-height: 1.6;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Content = styled.div`
  max-width: 1400px;
  margin: auto;
  padding: 30px 24px 80px;
`;

const Section = styled.section`
  margin-top: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 24px;
  font-weight: 700;
`;
