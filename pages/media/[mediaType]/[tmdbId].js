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
      <BackLink href={backHref}>← Back</BackLink>

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
  background: #141414;
  color: white;
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  text-align: center;
  padding: 40px;
`;

const Hero = styled.div`
  position: relative;
  height: 80vh;
  display: flex;
  align-items: flex-end;
`;

const Backdrop = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  max-width: 700px;
  padding: 30px;
  @media (max-width: 600px) {
    padding: 22px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 14px;
  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Genres = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Release = styled.span`
  color: #ccc;
  font-size: 0.9rem;
`;

const Fallback = styled.span`
  color: #888;
`;

const ButtonRow = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: ${({ $active }) => ($active ? "#e50914" : "white")};
  color: ${({ $active }) => ($active ? "white" : "black")};
  border: none;
  padding: 12px 18px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const StatusSelect = styled.select`
  background: #2a2a2a;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
`;

const Overview = styled.p`
  line-height: 1.7;
  color: #ddd;
  margin-top: 20px;
  max-width: 700px;
`;

const ContentSection = styled.section`
  max-width: 1100px;
  margin: auto;
  padding: 30px 20px;
`;

const TrailerSection = styled.section`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
`;

const TrailerWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: 12px;
  overflow: hidden;
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const CommentsSection = styled.section`
  margin-top: 30px;
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
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $upcoming }) =>
    $upcoming ? "rgba(229, 9, 20, 0.18)" : "rgba(46, 204, 113, 0.15)"};
  color: ${({ $upcoming }) => ($upcoming ? "#ff4d5a" : "#2ecc71")};
  border: 1px solid
    ${({ $upcoming }) =>
      $upcoming ? "rgba(229,9,20,0.4)" : "rgba(46,204,113,0.4)"};
`;
