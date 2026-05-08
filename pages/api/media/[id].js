import dbConnect from "@/db/connect";
import Media from "@/db/models/Media";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  if (request.method === "PATCH") {
    try {
      const media = await Media.findById(id);
      if (!media) {
        return response.status(404).json({ message: "Media not found" });
      }

      const {
        status,
        isFavorite,
        watchProgress,
        currentSeason,
        currentEpisode,
      } = request.body;
      if (watchProgress !== undefined) {
        media.watchProgress = watchProgress;
      }
      if (currentSeason !== undefined) {
        media.currentSeason = currentSeason;
      }
      if (currentEpisode !== undefined) {
        media.currentEpisode = currentEpisode;
      }
      if (status !== undefined) {
        media.status = status;
      }
      if (isFavorite !== undefined) {
        media.isFavorite = isFavorite;
      }
      if (currentSeason !== undefined) {
        const seasonNumber = Number(currentSeason);
        if (
          currentSeason === "" ||
          Number.isNaN(seasonNumber) ||
          seasonNumber < 1
        ) {
          return response
            .status(400)
            .json({ message: "Season must be greater than 0" });
        }
        media.currentSeason = seasonNumber;
      }
      if (currentEpisode !== undefined) {
        const episodeNumber = Number(currentEpisode);
        if (
          currentEpisode === "" ||
          Number.isNaN(episodeNumber) ||
          episodeNumber < 1
        ) {
          return response
            .status(400)
            .json({ message: "Episode must be greater than 0" });
        }
        media.currentEpisode = episodeNumber;
      }
      await media.save();
      return response.status(200).json(media);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Update failed" });
    }
  }
  if (request.method === "DELETE") {
    try {
      const deletedMedia = await Media.findByIdAndDelete(id);
      if (!deletedMedia) {
        return response.status(404).json({ message: "Media not found" });
      }
      return response.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Delete failed" });
    }
  }
  return response.status(405).json({ message: "Method not allowed" });
}
