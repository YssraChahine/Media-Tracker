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
  background: #1f1f1f;
  padding: 14px;
  border-radius: 10px;
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
  color: #ddd;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const LikeButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 4px 8px;
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
  color: #e50914;
  background: transparent;
  border: none;
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
