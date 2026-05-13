import { useState } from "react";
import styled from "styled-components";

export default function CommentsList({ comments, onEdit, onDelete, onLike }) {
  if (!comments.length) return <Empty>No comments yet</Empty>;

  return (
    <List>
      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </List>
  );
}

function CommentCard({ comment, onEdit, onDelete, onLike }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  function handleSave() {
    if (!text.trim()) return;
    onEdit(comment._id, text);
    setIsEditing(false);
  }

  return (
    <Card>
      <Header>
        <Timestamp>{new Date(comment.createdAt).toLocaleString()}</Timestamp>
      </Header>

      {isEditing ? (
        <EditArea>
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <EditActions>
            <SaveButton onClick={handleSave}>Save</SaveButton>
            <CancelButton onClick={() => setIsEditing(false)}>
              Cancel
            </CancelButton>
          </EditActions>
        </EditArea>
      ) : (
        <Text>{comment.text}</Text>
      )}

      <Actions>
        <LikeButton onClick={() => onLike(comment._id)}>
          ❤️ {comment.likes}
        </LikeButton>

        <Secondary onClick={() => setIsEditing(true)}>Edit</Secondary>

        <Danger onClick={() => onDelete(comment._id)}>Delete</Danger>
      </Actions>
    </Card>
  );
}

const List = styled.div`
  display: grid;
  gap: 20px;
  margin-top: 24px;
`;

const Card = styled.div`
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(229, 9, 20, 0.18);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 14px;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: #8f8f8f;
  letter-spacing: 0.03em;
`;

const Text = styled.p`
  color: #e2e2e2;
  line-height: 1.7;
  font-size: 0.96rem;
  margin-bottom: 18px;
  word-break: break-word;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const LikeButton = styled.button`
  padding: 10px 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.04)
  );
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(
      to bottom,
      rgba(229, 9, 20, 0.22),
      rgba(229, 9, 20, 0.12)
    );
  }
`;

const Secondary = styled.button`
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #d7d7d7;
  font-size: 0.82rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }
`;

const Danger = styled.button`
  padding: 10px 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(
    135deg,
    rgba(229, 9, 20, 0.22),
    rgba(229, 9, 20, 0.12)
  );
  color: #ff6b74;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(
      135deg,
      rgba(229, 9, 20, 0.35),
      rgba(229, 9, 20, 0.18)
    );
  }
`;

const EditArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  backdrop-filter: blur(10px);
  color: white;
  resize: none;
  font-size: 0.95rem;
  line-height: 1.6;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
  &::placeholder {
    color: #777;
  }
  &:focus {
    outline: none;
    border-color: rgba(229, 9, 20, 0.4);
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.05)
    );
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const SaveButton = styled.button`
  padding: 12px 18px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #2ecc71, #42d392);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 12px 24px rgba(46, 204, 113, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 35px rgba(46, 204, 113, 0.3);
  }
`;

const CancelButton = styled.button`
  padding: 12px 18px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: white;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }
`;

const Empty = styled.div`
  margin-top: 24px;
  padding: 32px;
  border-radius: 24px;
  text-align: center;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.04),
    rgba(255, 255, 255, 0.02)
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #8d8d8d;
`;
