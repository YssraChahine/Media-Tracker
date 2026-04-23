import useSWR from "swr";
import styled from "styled-components";
import BackButton from "@/components/BackButton";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MediaPage() {
  const { data, error, isLoading } = useSWR("/api/media", fetcher);

  if (isLoading) {
    return <Message>Loading...</Message>;
  }

  if (error) {
    return <Message>Error loading media</Message>;
  }

  if (!data || data.length === 0) {
    return (
      <main>
        <BackButton />
        <Heading>My Media List</Heading>
        <Message>No saved media yet</Message>
      </main>
    );
  }

  return (
    <Main>
      <BackButton />

      <Heading>My Media List</Heading>

      <Grid>
        {data.map((item) => (
          <Card key={item._id}>
            <Poster
              src={item.imageUrl || "/placeholder.jpg"}
              alt={item.title}
            />

            <Info>
              <Title>{item.title}</Title>
              <Type>{item.type}</Type>
              <Status>{item.status}</Status>
            </Info>
          </Card>
        ))}
      </Grid>
    </Main>
  );
}

const Main = styled.main`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 25px;
`;

const Message = styled.p`
  text-align: center;
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
`;

const Card = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
`;

const Poster = styled.img`
  width: 80px;
  border-radius: 6px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-weight: 600;
  margin: 0;
`;

const Type = styled.p`
  font-size: 0.8rem;
  color: #888;
`;

const Status = styled.p`
  font-size: 0.75rem;
  color: #aaa;
`;
