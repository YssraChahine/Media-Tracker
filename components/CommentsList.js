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
  gap: 14px;
  margin-top: 15px;
`;

const Card = styled.div`
  background: white;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Timestamp = styled.span`
  font-size: 0.7rem;
  color: #888;
`;

const Text = styled.p`
  margin: 10px 0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const LikeButton = styled.button`
  border: none;
  background: #f1f3f5;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    background: #e9ecef;
  }
`;

const Secondary = styled.button`
  border: none;
  background: transparent;
  color: #555;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Danger = styled.button`
  border: none;
  background: transparent;
  color: #e03131;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    text-decoration: underline;
  }
`;

const EditArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
`;

const SaveButton = styled.button`
  background: #2ecc71;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: #ddd;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
`;

const Empty = styled.p`
  color: #777;
`;
