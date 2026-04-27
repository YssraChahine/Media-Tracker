import dbConnect from "@/db/connect";
import Media from "@/db/models/Media";

export default async function handler(request, response) {
  await dbConnect();

  const { mediaType, tmdbId } = request.query;

  try {
    const MediaResponse = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`
    );

    if (!MediaResponse.ok) {
      return response.status(404).json({ error: "Not found in TMDB" });
    }

    const data = await MediaResponse.json();

    const dbMedia = await Media.findOne({
      apiId: String(tmdbId),
      type: mediaType === "tv" ? "series" : "movie",
    });

    const combined = {
      ...data,
      media_type: mediaType,
      userData: dbMedia
        ? {
            _id: dbMedia._id,
            status: dbMedia.status,
            isFavorite: dbMedia.isFavorite,
          }
        : null,
    };

    response.status(200).json(combined);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to load details" });
  }
}
