import dbConnect from "@/db/connect";
import Media from "@/db/models/Media";

export default async function handler(request, response) {
  await dbConnect();

  try {
    const savedMedia = await Media.find();

    if (!savedMedia.length) {
      return response.status(200).json([]);
    }

    const favoriteMedia = savedMedia.filter((item) => item.isFavorite);
    const baseMedia = favoriteMedia.length > 0 ? favoriteMedia : savedMedia;
    const randomItem = baseMedia[Math.floor(Math.random() * baseMedia.length)];
    const mediaType = randomItem.type === "series" ? "tv" : "movie";
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${randomItem.apiId}/recommendations?api_key=${process.env.TMDB_API_KEY}`
    );

    if (!tmdbResponse.ok) {
      return response.status(500).json([]);
    }

    const data = await tmdbResponse.json();

    const savedIds = savedMedia.map((item) => Number(item.apiId));

    const filtered = data.results.filter(
      (item) =>
        !savedIds.includes(item.id) &&
        (item.media_type === "movie" || item.media_type === "tv" || mediaType)
    );

    response.status(200).json(filtered.slice(0, 10));
  } catch (error) {
    console.error(error);

    response.status(500).json([]);
  }
}
