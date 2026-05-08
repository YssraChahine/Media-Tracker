import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

export default function ProgressTracker({
  mediaType,
  media,
  totalEpisodes,
  seasons = [],
  onSave,
}) {
  const [season, setSeason] = useState(media.currentSeason || 1);
  const [episode, setEpisode] = useState(media.currentEpisode || 1);
  const [progress, setProgress] = useState(media.watchProgress || 0);
  const selectedSeason = useMemo(() => {
    return seasons.find((item) => item.season_number === Number(season));
  }, [season, seasons]);
  useEffect(() => {
    if (mediaType === "tv" && totalEpisodes > 0) {
      const watchedPreviousEpisodes = seasons
        .filter((item) => item.season_number < Number(season))
        .reduce((sum, item) => sum + item.episode_count, 0);
      const watchedEpisodes = watchedPreviousEpisodes + Number(episode);
      const calculated = Math.min((watchedEpisodes / totalEpisodes) * 100, 100);
      setProgress(Math.round(calculated));
    }
  }, [episode, season, seasons, totalEpisodes, mediaType]);

  useEffect(() => {
    if (selectedSeason && episode > selectedSeason.episode_count) {
      setEpisode(1);
    }
  }, [selectedSeason, episode]);

  async function handleSave() {
    await onSave({
      currentSeason: Number(season),
      currentEpisode: Number(episode),
      watchProgress: Number(progress),
    });
  }

  return (
    <Wrapper>
      <Title>Continue Watching</Title>
      <ProgressInfo>{progress}% watched</ProgressInfo>
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>
      {mediaType === "movie" ? (
        <MovieSection>
          <Slider
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(event) => setProgress(event.target.value)}
          />
        </MovieSection>
      ) : (
        <SeriesFields>
          <Field>
            <Label>Season</Label>
            <Select
              value={season}
              onChange={(event) => setSeason(event.target.value)}
            >
              {seasons.map((item) => (
                <option key={item.id} value={item.season_number}>
                  Season {item.season_number}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label>Episode</Label>
            <Select
              value={episode}
              onChange={(event) => setEpisode(event.target.value)}
            >
              {selectedSeason &&
                Array.from({
                  length: selectedSeason.episode_count,
                }).map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Episode {index + 1}
                  </option>
                ))}
            </Select>
          </Field>
        </SeriesFields>
      )}
      <SaveButton onClick={handleSave}>Save Progress</SaveButton>
      {mediaType === "tv" && (
        <Current>
          Season {season} • Episode {episode}
        </Current>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: 30px;
  padding: 24px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
`;

const Title = styled.h2`
  margin-bottom: 18px;
`;

const ProgressInfo = styled.p`
  color: #bbb;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
`;

const ProgressFill = styled.div`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: #e50914;
`;

const MovieSection = styled.div`
  margin-top: 20px;
`;

const Slider = styled.input`
  width: 100%;
`;

const SeriesFields = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #bbb;
  font-size: 0.85rem;
`;

const Select = styled.select`
  min-width: 160px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #2a2a2a;
  color: white;
`;

const SaveButton = styled.button`
  margin-top: 24px;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #e50914;
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Current = styled.p`
  margin-top: 16px;
  color: #bbb;
`;
