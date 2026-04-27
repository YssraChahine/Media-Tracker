import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function MediaDetails() {
  const router = useRouter();
  const { mediaType, tmdbId, from } = router.query;

  const { data, error, isLoading, mutate } = useSWR(
    mediaType && tmdbId ? `/api/media/details/${mediaType}/${tmdbId}` : null,
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

  async function handleAdd() {
    try {
      const NewResponse = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiId: tmdbId,
          title: data.title || data.name,
          type: mediaType === "tv" ? "series" : "movie",
          imageUrl: data.poster_path
            ? `https://image.tmdb.org/t/p/w200${data.poster_path}`
            : "",
        }),
      });

      if (!NewResponse.ok) throw new Error("Add failed");

      mutate();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      const StatusResponse = await fetch(`/api/media/${data.userData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!StatusResponse.ok) throw new Error("Update failed");

      mutate();
    } catch (error) {
      console.error(error);
    }
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

          {!isSaved && (
            <AddButton onClick={handleAdd}>+ Add to My List</AddButton>
          )}

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
    </Main>
  );
}

const Main = styled.main`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;
  color: #111;
`;

const Message = styled.p`
  text-align: center;
`;

const Hero = styled.div`
  display: flex;
  gap: 30px;
`;

const Poster = styled.img`
  width: 300px;
  border-radius: 12px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const Overview = styled.p`
  margin-top: 20px;
  line-height: 1.5;
`;

const AddButton = styled.button`
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: black;
  color: white;
  cursor: pointer;
`;

const Controls = styled.div`
  margin: 10px 0;
`;

const StatusSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
`;
