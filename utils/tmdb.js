export async function searchMedia(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  const data = await response.json();
  return data.results;
}
