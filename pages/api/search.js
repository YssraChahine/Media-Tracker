export default async function handler(request, response) {
  const { query } = request.query;

  if (!query) {
    return response.status(400).json({ error: "Query is required" });
  }
  try {
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    if (!tmdbResponse.ok) {
      const text = await tmdbResponse.text();
      console.error("TMDB error:", text);
      return response
        .status(tmdbResponse.status)
        .json({ error: "Failed to fetch TMDB data" });
    }
    const data = await tmdbResponse.json();
    const filteredResults = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
    return response.status(200).json(filteredResults);
  } catch (error) {
    console.error("Search API error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}
