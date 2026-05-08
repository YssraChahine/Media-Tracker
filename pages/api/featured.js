export default async function handler(request, response) {
  const API_KEY = process.env.TMDB_API_KEY;

  try {
    const MediaResponse = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`
    );
    if (!MediaResponse.ok) {
      throw new Error("Failed to fetch featured media.");
    }
    const data = await MediaResponse.json();
    const filtered = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
    response.status(200).json(filtered.slice(0, 10));
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to fetch featured media." });
  }
}
