import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import BookmarkButton from "./BookmarkButton";

export default function MyMediaCard({
  item,
  onDelete,
  onToggleFavorite,
  mutate,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleStatusChange(newStatus) {
    try {
      const response = await fetch(`/api/media/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Update failed.");
      mutate?.();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Card>
        <Link
          href={`/media/${item.type === "series" ? "tv" : "movie"}/${item.apiId}?from=my-list`}
        >
          {" "}
          <PosterWrapper>
            <Poster
              src={item.imageUrl || "/placeholder.jpg"}
              alt={item.title}
            />
            <Overlay />
            <BookmarkButton
              isFavorite={item.isFavorite}
              onToggle={() => onToggleFavorite(item._id, item.isFavorite)}
            />
          </PosterWrapper>
        </Link>

        <Content>
          <TopRow>
            <Title>{item.title}</Title>
            <DeleteButton
              type="button"
              onClick={() => {
                setShowConfirm(true);
              }}
            >
              X
            </DeleteButton>
          </TopRow>

          <Modal>
            <Type>{item.type}</Type>
            <StatusSelect
              value={item.status}
              onChange={(event) => {
                handleStatusChange(event.target.value);
              }}
            >
              <option value="planned">Planned</option>
              <option value="in progress">In progress</option>
              <option value="completed">Completed</option>
            </StatusSelect>
          </Modal>
        </Content>
      </Card>

      {showConfirm && (
        <ModeOverlay>
          <Mode>
            <Text>Are you sure you want to delete this Media?</Text>

            <ButtonRow>
              <CancelButton onClick={() => setShowConfirm(false)}>
                {" "}
                Cancel
              </CancelButton>

              <ConfirmButton
                onClick={() => {
                  onDelete(item._id);
                  setShowConfirm(false);
                }}
              >
                Delete
              </ConfirmButton>
            </ButtonRow>
          </Mode>
        </ModeOverlay>
      )}
    </>
  );
}

const Card = styled.div`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transform: translateY(0);
  transition: all 0.25s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
  &:hover img {
    transform: scale(1.08);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;
  padding: 14px;
  width: 100%;
  color: white;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.h3`
  font-size: 0.9rem;
  max-width: 80%;
`;

const Modal = styled.div`
  margin-top: 6px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Type = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
`;

const StatusSelect = styled.select`
  padding: 3px 6px;
  border-radius: 999px;
  border: none;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const DeleteButton = styled.button`
  border: none;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  ${Card}:hover & {
    opacity: 1;
  }
  &:hover {
    background: rgba(255, 77, 79, 0.9);
  }
`;

const ModeOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Mode = styled.div`
  background: white;
  padding: 25px;
  border-radius: 14px;
  width: 300px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Text = styled.p`
  margin-bottom: 20px;
  font-size: 0.95rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const CancelButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const ConfirmButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background: #ff4d4f;
  color: white;
  cursor: pointer;
  &:hover {
    background: #e03131;
  }
`;
const PosterWrapper = styled.div`
  position: relative;
  cursor: pointer;
  &:hover button {
    opacity: 1;
    transform: scale(1);
  }
`;
