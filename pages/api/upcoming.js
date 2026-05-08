export default async function handler(request, response) {
  try {
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`
    );

    const tvResponse = await fetch(
      `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}`
    );

    const movieData = await movieResponse.json();
    const tvData = await tvResponse.json();

    const movies = movieData.results.map((item) => ({
      ...item,
      media_type: "movie",
    }));

    const series = tvData.results.map((item) => ({
      ...item,
      media_type: "tv",
    }));

    const combined = [...movies, ...series];
    const today = new Date();
    const filtered = combined.filter((item) => {
      const date = item.release_date || item.first_air_date;
      return date && new Date(date) > today;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date);
      const dateB = new Date(b.release_date || b.first_air_date);
      return dateA - dateB;
    });

    response.status(200).json(filtered.slice(0, 10));
  } catch (error) {
    console.error(error);

    response.status(500).json([]);
  }
}
