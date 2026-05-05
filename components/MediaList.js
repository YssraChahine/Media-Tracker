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
  gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
`;

const Message = styled.p`
  text-align: center;
  color: #666;
`;
