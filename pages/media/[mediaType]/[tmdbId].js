import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import Link from "next/link";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";
import GenreTag from "@/components/GenreTag";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function MediaDetails() {
  function formatDate(dateString) {
    if (!dateString) return "Unknown";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  }
  const router = useRouter();
  const { mediaType, tmdbId, from } = router.query;

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
        const toggleResponse = await fetch("/api/media", {
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

        if (!toggleResponse.ok) throw new Error("Add failed");
      } else {
        const newResponse = await fetch(`/api/media/${data.userData._id}`, {
          method: "DELETE",
        });

        if (!newResponse.ok) throw new Error("Delete failed");
      }

      mutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      const statusResponse = await fetch(`/api/media/${data.userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!statusResponse.ok) throw new Error("Update failed");

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

  async function handleDeleteComment(id) {
    await fetch(`/api/media/${tmdbId}/comments/${id}`, {
      method: "DELETE",
    });
    mutateComments();
  }

  async function handleLike(id) {
    const likeResponse = await fetch(`/api/media/${tmdbId}/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like" }),
    });

    if (!likeResponse.ok) {
      const error = await likeResponse.json();
      console.error("LIKE ERROR:", error);
      return;
    }

    mutateComments();
  }

  return (
    <Main>
      <BackLink href={backHref}>
        {from === "my-list" ? "← Back to My List" : "← Back to Home"}
      </BackLink>

      <Hero>
        <Poster
          src={
            data.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : "/placeholder.jpg"
          }
          alt={data.title || data.name}
        />

        <Info>
          <Title>{data.title || data.name}</Title>
          <MetaRow>
            <Genres>
              {data.genres?.length > 0 ? (
                data.genres.map((genre) => (
                  <GenreTag key={genre.id} label={genre.name} />
                ))
              ) : (
                <Fallback>No genres available</Fallback>
              )}
            </Genres>

            <Release>
              {formatDate(data.release_date || data.first_air_date)}
            </Release>
          </MetaRow>
          <ToggleButton onClick={handleToggle} $active={isSaved}>
            {isSaved ? "✓ Added (Remove)" : "+ Add to My List"}
          </ToggleButton>

          {isSaved && (
            <Controls>
              <StatusSelect
                value={data.userData.status}
                onChange={(event) => handleStatusChange(event.target.value)}
              >
                <option value="planned">Planned</option>
                <option value="in progress">In progress</option>
                <option value="completed">Completed</option>
              </StatusSelect>
            </Controls>
          )}

          <Overview>{data.overview}</Overview>
        </Info>
      </Hero>

      {isSaved && (
        <CommentsSection>
          <h2>Comments</h2>

          <CommentForm onAdd={handleAdd} />

          <CommentsList
            comments={comments}
            onEdit={handleEdit}
            onDelete={handleDeleteComment}
            onLike={handleLike}
          />
        </CommentsSection>
      )}
    </Main>
  );
}

const Main = styled.main`
  max-width: 1100px;
  margin: auto;
  padding: 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;
  color: #fff;
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  text-align: center;
`;

const Hero = styled.div`
  display: flex;
  gap: 20px;
`;

const Poster = styled.img`
  width: 300px;
  border-radius: 8px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const Overview = styled.p`
  color: #ccc;
`;

const ToggleButton = styled.button`
  margin: 10px 0;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: ${({ $active }) => ($active ? "#cc2e2e" : "#525050")};
  color: white;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const Controls = styled.div`
  margin: 10px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StatusSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
`;

const CommentsSection = styled.div`
  margin-top: 40px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Genres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Release = styled.span`
  color: #aaa;
`;

const Fallback = styled.span`
  font-size: 0.8rem;
  color: #777;
`;
