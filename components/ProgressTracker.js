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
  const selectedSeason = seasons.find(
    (item) => item.season_number === Number(season)
  );
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

  function handleSeasonChange(event) {
    const nextSeason = Number(event.target.value);
    setSeason(nextSeason);
    const foundSeason = seasons.find(
      (item) => item.season_number === nextSeason
    );
    if (foundSeason && episode > foundSeason.episode_count) {
      setEpisode(1);
    }
  }

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
            onChange={(event) => setProgress(Number(event.target.value))}
          />
        </MovieSection>
      ) : (
        <SeriesFields>
          <Field>
            <Label>Season</Label>
            <Select value={season} onChange={handleSeasonChange}>
              {seasons.map((item) => (
                <option key={item.season_number} value={item.season_number}>
                  Season {item.season_number}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label>Episode</Label>
            <Select
              value={episode}
              onChange={(event) => setEpisode(Number(event.target.value))}
            >
              {selectedSeason &&
                Array.from({
                  length: selectedSeason.episode_count,
                }).map((_, index) => {
                  const episodeNumber = index + 1;
                  return (
                    <option
                      key={`episode-${episodeNumber}`}
                      value={episodeNumber}
                    >
                      Episode {episodeNumber}
                    </option>
                  );
                })}
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
  margin: 50px auto 0;
  width: 100%;
  max-width: 720px;
  padding: 28px;
  border-radius: 28px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 22px;
    border-radius: 22px;
  }
`;

const Title = styled.h2`
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`;

const ProgressInfo = styled.p`
  color: #9d9d9d;
  font-size: 0.9rem;
  margin-bottom: 16px;
`;

const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.35);
`;

const ProgressFill = styled.div`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #e50914 0%, #ff3040 50%, #ff5964 100%);
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.35);
  transition: width 0.3s ease;
`;

const MovieSection = styled.div`
  margin-top: 24px;
`;

const Slider = styled.input`
  width: 100%;
  appearance: none;
  background: transparent;
  cursor: pointer;
  &::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.05)
    );
  }
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-top: -5px;
    background: #e50914;
    border: 2px solid white;
    box-shadow: 0 0 15px rgba(229, 9, 20, 0.4);
    transition: transform 0.2s ease;
  }
  &::-webkit-slider-thumb:hover {
    transform: scale(1.08);
  }
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
  color: #b3b3b3;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
`;

const Select = styled.select`
  min-width: 170px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
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
    border-color 0.2s ease,
    transform 0.2s ease;
  &:focus {
    outline: none;
    border-color: rgba(229, 9, 20, 0.45);
  }
  &:hover {
    transform: translateY(-1px);
  }
`;

const SaveButton = styled.button`
  margin-top: 28px;
  padding: 14px 20px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #e50914, #ff3040);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 12px 24px rgba(229, 9, 20, 0.22);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 35px rgba(229, 9, 20, 0.35);
  }
`;

const Current = styled.div`
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #d0d0d0;
  font-size: 0.82rem;
  font-weight: 500;
`;
