import styled from "styled-components";

export default function MyMediaCard({ item, onDelete }) {
  return (
    <Card>
      <PosterWrapper>
        <Poster src={item.imageUrl || "/placeholder.jpg"} alt={item.title} />
      </PosterWrapper>

      <Content>
        <TopRow>
          <Title>{item.title}</Title>
          <DeleteButton onClick={() => onDelete(item._id)}>X</DeleteButton>
        </TopRow>

        <Type>{item.type}</Type>

        <Status>{item.status}</Status>
      </Content>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const PosterWrapper = styled.div`
  width: 100%;
  height: 280px;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.p`
  font-weight: 600;
  margin: 0;
`;

const Type = styled.p`
  font-size: 0.8rem;
  color: #888;
  margin: 0;
`;

const Status = styled.span`
  margin-top: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  background: #eee;
  align-self: flex-start;
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    opacity: 0.6;
  }
`;
