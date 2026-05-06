export default async function handler(request, response) {
  const { mediaType, id } = request.query;

  try {
    const trailerResponse = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.TMDB_API_KEY}`
    );

    const data = await trailerResponse.json();

    const trailer = data.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );

    response.status(200).json({
      key: trailer?.key || null,
    });
  } catch (error) {
    response.status(500).json({
      error: "Failed to fetch trailer",
    });
  }
}
