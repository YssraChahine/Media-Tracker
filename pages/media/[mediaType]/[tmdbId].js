import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import Link from "next/link";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";
import GenreTag from "@/components/GenreTag";

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

            <Release>
              {formatDate(data.release_date || data.first_air_date)}
            </Release>
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

          <Overview>{data.overview}</Overview>
        </HeroContent>
      </Hero>

      <ContentSection>
        {data.trailerKey ? (
          <TrailerSection>
            <SectionTitle>Trailer</SectionTitle>

            <TrailerWrapper>
              <iFrame
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
      </ContentSection>

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
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin: 15px;
  color: #aaa;
`;

const Message = styled.p`
  text-align: center;
`;

const Hero = styled.div`
  position: relative;
  height: 75vh;
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
    transparent
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 20px;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const MetaRow = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const Genres = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Release = styled.span`
  color: #ccc;
`;

const Fallback = styled.span`
  color: #777;
`;

const ButtonRow = styled.div`
  margin: 15px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: ${({ $active }) => ($active ? "#e50914" : "white")};
  color: ${({ $active }) => ($active ? "white" : "black")};
  border: none;
  padding: 10px 18px;
  cursor: pointer;
`;

const StatusSelect = styled.select`
  padding: 8px;
`;

const Overview = styled.p`
  margin-top: 10px;
  color: #ddd;
`;

const ContentSection = styled.div`
  padding: 20px;
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
