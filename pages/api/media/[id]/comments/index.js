import dbConnect from "@/db/connect";
import Media from "@/db/models/Media";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  let media = await Media.findOne({ apiId: String(id) });

  if (!media) {
    if (request.method === "GET") {
      return response.status(200).json([]);
    }
    if (request.method === "POST") {
      media = await Media.create({
        apiId: String(id),
        title: "",
        type: "movie",
        comments: [],
      });
    }
  }
  if (request.method === "GET") {
    return response.status(200).json(media.comments || []);
  }
  if (request.method === "POST") {
    const { text } = request.body;
    if (!text) {
      return response.status(400).json({ message: "Text required" });
    }
    media.comments.unshift({
      text,
      likes: 0,
      createdAt: new Date(),
    });
    await media.save();
    return response.status(200).json(media.comments);
  }
}
