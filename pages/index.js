import { useState } from "react";
import { searchMedia } from "@/utils/tmdb";
import SearchBar from "@/components/SearchBar";
import styled from "styled-components";
import Link from "next/link";
import useSWR from "swr";
import MediaCard from "@/components/MediaCard";
import RecommendationsSection from "@/components/RecommendationsSection";
import UpcomingSection from "@/components/UpcomingSection";
import toast from "react-hot-toast";

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

  const addedIds = Array.isArray(media)
    ? media.map((item) => Number(item.apiId))
    : [];
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
        if (!response.ok) {
          throw new Error("Add failed");
        }
        toast.success("Added to your collection");
      } else {
        const removeResponse = await fetch(`/api/media/${existing._id}`, {
          method: "DELETE",
        });
        if (!removeResponse.ok) {
          throw new Error("Delete failed");
        }
        toast.success("Removed from collection");
      }
      mutate();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
  background:
    radial-gradient(circle at top, rgba(229, 9, 20, 0.12), transparent 30%),
    #050505;
  color: white;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  padding: 60px;
  overflow: hidden;
  background-image:
    linear-gradient(
      to right,
      rgba(5, 5, 5, 0.44),
      rgba(5, 5, 5, 0.1),
      rgba(5, 5, 5, 0.03)
    ),
    url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  @media (max-width: 768px) {
    min-height: 78vh;
    padding: 30px 22px;
  }
`;

const Message = styled.p`
  text-align: center;
  color: #9a9a9a;
  margin-top: 40px;
  font-size: 0.95rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 28px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
    gap: 18px;
  }
`;

const ViewButton = styled.button`
  position: relative;
  overflow: hidden;
  border: none;
  padding: 18px 30px;
  border-radius: 18px;
  background: linear-gradient(135deg, #e50914, #ff3040);
  color: white;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 20px 45px rgba(229, 9, 20, 0.35);
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 28px 60px rgba(229, 9, 20, 0.42);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(5, 5, 5, 1) 5%,
    rgba(5, 5, 5, 0.78) 35%,
    rgba(5, 5, 5, 0.25) 100%
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 760px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(3.5rem, 9vw, 7rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -4px;
  margin-bottom: 26px;
  background: linear-gradient(to bottom, #ffffff, #9d9d9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 768px) {
    letter-spacing: -2px;
  }
`;

const HeroText = styled.p`
  max-width: 620px;
  font-size: 1.15rem;
  line-height: 1.9;
  color: #d0d0d0;
  margin-bottom: 38px;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1500px;
  margin: -80px auto 0;
  padding: 0 24px 120px;
`;

const Section = styled.section`
  margin-top: 90px;
`;

const SectionTitle = styled.h2`
  position: relative;
  display: inline-block;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  letter-spacing: -2px;
  margin-bottom: 34px;
  background: linear-gradient(to bottom, #ffffff, #9f9f9f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 70%;
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      rgba(229, 9, 20, 1),
      rgba(229, 9, 20, 0)
    );
  }
`;
