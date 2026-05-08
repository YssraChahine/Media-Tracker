import { useState } from "react";
import styled from "styled-components";

export default function SeriesProgress({ media, onUpdate }) {
  const [season, setSeason] = useState(media.currentSeason ?? "");
  const [episode, setEpisode] = useState(media.currentEpisode ?? "");
  const [error, setError] = useState("");

  const hasProgress =
    media.currentSeason !== null &&
    media.currentSeason !== undefined &&
    media.currentEpisode !== null &&
    media.currentEpisode !== undefined;

  async function handleSave() {
    setError("");

    if (season === "" || episode === "") {
      setError("Please enter season and episode.");
      return;
    }

    const seasonNumber = Number(season);
    const episodeNumber = Number(episode);

    if (
      Number.isNaN(seasonNumber) ||
      Number.isNaN(episodeNumber) ||
      seasonNumber < 1 ||
      episodeNumber < 1
    ) {
      setError("Season and episode must be greater than 0.");
      return;
    }

    await onUpdate({
      currentSeason: seasonNumber,
      currentEpisode: episodeNumber,
    });
  }

  return (
    <Wrapper>
      <Header>
        <Title>Series Progress</Title>

        <CurrentProgress>
          {hasProgress
            ? `S${media.currentSeason} · E${media.currentEpisode}`
            : "No progress yet"}
        </CurrentProgress>
      </Header>

      <Inputs>
        <InputGroup>
          <Label>Season</Label>
          <Input
            type="number"
            min="1"
            value={season}
            onChange={(event) => setSeason(event.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label>Episode</Label>
          <Input
            type="number"
            min="1"
            value={episode}
            onChange={(event) => setEpisode(event.target.value)}
          />
        </InputGroup>
      </Inputs>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SaveButton type="button" onClick={handleSave}>
        Save Progress
      </SaveButton>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  margin: 25px;
  padding: 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  max-width: 420px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 1rem;
`;

const CurrentProgress = styled.span`
  font-size: 0.8rem;
  color: #bbb;
`;

const Inputs = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.75rem;
  color: #aaa;
`;

const Input = styled.input`
  width: 110px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #2a2a2a;
  color: white;
  &:focus {
    outline: 2px solid #e50914;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 10px;
  font-size: 0.8rem;
  color: #ff6b6b;
`;

const SaveButton = styled.button`
  margin-top: 16px;
  border: none;
  padding: 11px 14px;
  border-radius: 8px;
  background: #e50914;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
