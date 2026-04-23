import useSWR from "swr";
import styled from "styled-components";
import BackButton from "@/components/BackButton";
import MyMediaCard from "@/components/MyMediaCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MediaPage() {
  const { data: media = [], mutate } = useSWR("/api/media", fetcher);

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
  return (
    <Main>
      <BackButton />

      <Heading>My Media List</Heading>
      {media.length === 0 && <Message>No media added yet</Message>}

      <Grid>
        {media.map((item) => (
          <MyMediaCard key={item._id} item={item} onDelete={handleDelete} />
        ))}
      </Grid>
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
  margin-bottom: 20px;
`;

const Message = styled.p`
  text-align: center;
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;
