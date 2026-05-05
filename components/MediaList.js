import MyMediaCard from "./MyMediaCard";
import styled from "styled-components";

export default function MediaList({
  media,
  onDelete,
  onToggleFavorite,
  mutate,
}) {
  if (media.length === 0) {
    return <Message>No media added yet</Message>;
  }

  return (
    <Grid>
      {media.map((item) => (
        <MyMediaCard
          key={item._id}
          item={item}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          mutate={mutate}
        />
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Message = styled.p`
  text-align: center;
  color: #666;
`;
