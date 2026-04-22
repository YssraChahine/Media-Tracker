export async function searchMedia(query) {
  const response = await fetch(
    `/api/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
}
