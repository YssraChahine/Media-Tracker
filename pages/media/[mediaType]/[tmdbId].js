import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import Link from "next/link";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";
import GenreTag from "@/components/GenreTag";
import ProgressTracker from "@/components/ProgressTracker";
import RatingBadge from "@/components/RatingBadge";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function MediaDetails() {
  const router = useRouter();
  const { mediaType, tmdbId, from } = router.query;

  function formatDate(dateString) {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function isUpcoming(dateString) {
    if (!dateString) return false;
    return new Date(dateString) > new Date();
  }

  function getReleaseLabel(dateString) {
    if (!dateString) return "Unknown";
    return isUpcoming(dateString) ? "Coming Soon" : "Released";
  }

  const { data, error, isLoading, mutate } = useSWR(
    mediaType && tmdbId ? `/api/media/details/${mediaType}/${tmdbId}` : null,
    fetcher
  );

  const { data: comments = [], mutate: mutateComments } = useSWR(
    tmdbId ? `/api/media/${tmdbId}/comments` : null,
    fetcher
  );

  const backHref = from === "my-list" ? "/media" : "/";

  if (isLoading) {
    return (
      <Main>
        <BackLink href={backHref}>← Back</BackLink>
        <Message>Loading...</Message>
      </Main>
    );
  }

  if (error || !data) {
    return (
      <Main>
        <BackLink href={backHref}>← Back</BackLink>
        <Message>Error loading details</Message>
      </Main>
    );
  }

  const isSaved = !!data.userData;
  const releaseDate = data.release_date || data.first_air_date;
  const upcoming = isUpcoming(releaseDate);

  async function handleToggle() {
    try {
      if (!isSaved) {
        await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiId: tmdbId,
            title: data.title || data.name,
            type: mediaType === "tv" ? "series" : "movie",
            imageUrl: data.poster_path
              ? `https://image.tmdb.org/t/p/w200${data.poster_path}`
              : "",
          }),
        });
      } else {
        await fetch(`/api/media/${data.userData._id}`, {
          method: "DELETE",
        });
      }
      mutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStatusChange(status) {
    await fetch(`/api/media/${data.userData._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  }

  async function handleProgressSave(progressData) {
    try {
      await fetch(`/api/media/${data.userData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(progressData),
      });

      mutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAdd(text) {
    await fetch(`/api/media/${tmdbId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    mutateComments();
  }

  async function handleEdit(id, text) {
    await fetch(`/api/media/${tmdbId}/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    mutateComments();
  }

  async function handleDelete(id) {
    await fetch(`/api/media/${tmdbId}/comments/${id}`, {
      method: "DELETE",
    });
    mutateComments();
  }

  async function handleLike(id) {
    await fetch(`/api/media/${tmdbId}/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like" }),
    });
    mutateComments();
  }

  return (
    <Main>
      {/* <BackLink href={backHref}>← Back</BackLink> */}

      <Hero>
        <Backdrop
          src={
            data?.backdrop_path
              ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
              : data?.poster_path
                ? `https://image.tmdb.org/t/p/original${data.poster_path}`
                : "/placeholder.jpg"
          }
        />

        <Overlay />

        <HeroContent>
          <Title>{data.title || data.name}</Title>

          <MetaRow>
            <Genres>
              {data.genres?.length > 0 ? (
                data.genres.map((genre) => (
                  <GenreTag key={genre.id} label={genre.name} />
                ))
              ) : (
                <Fallback>No genres</Fallback>
              )}
            </Genres>

            <ReleaseWrapper>
              <Release>
                {formatDate(data.release_date || data.first_air_date)}
              </Release>
              <ReleaseBadge $upcoming={upcoming}>
                {getReleaseLabel(releaseDate)}
              </ReleaseBadge>
            </ReleaseWrapper>
            {mediaType === "tv" && (
              <SeasonCount>
                {data.number_of_seasons
                  ? `${data.number_of_seasons} ${
                      data.number_of_seasons === 1 ? "Season" : "Seasons"
                    }`
                  : "Unknown Seasons"}
              </SeasonCount>
            )}
          </MetaRow>

          <ButtonRow>
            <PrimaryButton onClick={handleToggle} $active={isSaved}>
              {isSaved ? "✓ Added" : "+ My List"}
            </PrimaryButton>

            {isSaved && (
              <StatusSelect
                value={data.userData.status}
                onChange={(event) => handleStatusChange(event.target.value)}
              >
                <option value="planned">Planned</option>
                <option value="in progress">In progress</option>
                <option value="completed">Completed</option>
              </StatusSelect>
            )}
          </ButtonRow>

          <RatingBadge rating={data.vote_average} votes={data.vote_count} />
          <Overview>{data.overview}</Overview>
        </HeroContent>
      </Hero>
      {isSaved && (
        <ProgressTracker
          mediaType={mediaType}
          media={data.userData}
          totalEpisodes={data.number_of_episodes || 0}
          seasons={data.seasons || []}
          onSave={handleProgressSave}
        />
      )}
      <ContentSection>
        {data.trailerKey ? (
          <TrailerSection>
            <SectionTitle>Trailer</SectionTitle>

            <TrailerWrapper>
              <iframe
                src={`https://www.youtube.com/embed/${data.trailerKey}`}
                title="Trailer"
                allowFullScreen
              />
            </TrailerWrapper>
          </TrailerSection>
        ) : (
          <TrailerSection>
            <SectionTitle>Trailer</SectionTitle>
            <Fallback>No trailer available</Fallback>
          </TrailerSection>
        )}

        {isSaved && (
          <CommentsSection>
            <SectionTitle>Comments</SectionTitle>
            <CommentForm onAdd={handleAdd} />
            <CommentsList
              comments={comments}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          </CommentsSection>
        )}
      </ContentSection>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  overflow-x: hidden;
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 26px;
  left: 26px;
  z-index: 30;
  padding: 12px 18px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 0.9rem;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Message = styled.p`
  text-align: center;
  padding: 60px;
  color: #8d8d8d;
`;

const Hero = styled.section`
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
`;

const Backdrop = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.03);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 10, 1) 5%,
    rgba(10, 10, 10, 0.88) 25%,
    rgba(10, 10, 10, 0.45) 55%,
    rgba(10, 10, 10, 0.2) 100%
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 820px;
  padding: 90px 40px 50px;
  @media (max-width: 768px) {
    padding: 120px 22px 30px;
  }
`;

const Title = styled.h1`
  font-size: clamp(3rem, 8vw, 5.8rem);
  line-height: 0.92;
  letter-spacing: -3px;
  font-weight: 900;
  margin-bottom: 24px;
  background: linear-gradient(to bottom, #fff, #bfbfbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
`;

const Genres = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Release = styled.span`
  color: #c5c5c5;
  font-size: 0.92rem;
`;

const Fallback = styled.span`
  color: #8a8a8a;
`;

const ButtonRow = styled.div`
  margin: 30px 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`;

const PrimaryButton = styled.button`
  padding: 16px 24px;
  border-radius: 18px;
  border: none;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg,#e50914,#ff3040)"
      : "linear-gradient(135deg,#ffffff,#d9d9d9)"};
  color: ${({ $active }) => ($active ? "white" : "black")};
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: ${({ $active }) =>
    $active
      ? "0 18px 40px rgba(229,9,20,0.28)"
      : "0 10px 25px rgba(255,255,255,0.12)"};
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatusSelect = styled.select`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.04)
  );
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: rgba(229, 9, 20, 0.4);
  }
`;

const Overview = styled.p`
  margin-top: 28px;
  max-width: 760px;
  line-height: 1.9;
  color: #d3d3d3;
  font-size: 1rem;
`;

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 120px;
`;

const TrailerSection = styled.section`
  margin-bottom: 70px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 24px;
`;

const TrailerWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;
const CommentsSection = styled.section`
  margin-top: 80px;
`;

const SeasonCount = styled.span`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const ReleaseWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ReleaseBadge = styled.span`
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  backdrop-filter: blur(10px);
  background: ${({ $upcoming }) =>
    $upcoming ? "rgba(229,9,20,0.18)" : "rgba(46,204,113,0.16)"};
  color: ${({ $upcoming }) => ($upcoming ? "#ff626d" : "#49d98d")};
  border: 1px solid
    ${({ $upcoming }) =>
      $upcoming ? "rgba(229,9,20,0.35)" : "rgba(46,204,113,0.35)"};
`;
