import MyMediaCard from "./MyMediaCard";
import styled from "styled-components";

export default function MediaList({ media, onDelete, mutate }) {
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
          mutate={mutate}
        />
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const Message = styled.p`
  text-align: center;
  color: #666;
`;
