import dbConnect from "@/db/connect";
import Media from "@/db/models/Media";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const media = await Media.find();
      return response.status(200).json(media);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to fetch media" });
    }
  }
  if (request.method === "POST") {
    try {
      const { apiId, title, type, imageUrl } = request.body;

      const existing = await Media.findOne({ apiId });

      if (existing) {
        return response.status(409).json({ message: "Already exists" });
      }

      const newMedia = await Media.create({
        apiId,
        title,
        type,
        imageUrl,
      });

      return response.status(201).json(newMedia);
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
  return response.status(405).json({ message: "Method not allowed" });
}
