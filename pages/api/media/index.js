import dbConnect from "@/db/connect";
import Media from "@/db/models/Media";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();

  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({
      message: "Unauthorized",
    });
  }

  if (request.method === "GET") {
    try {
      const media = await Media.find({ userId: session.user.id });
      return response.status(200).json(media);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to fetch media" });
    }
  }
  if (request.method === "POST") {
    try {
      const { apiId, title, type, imageUrl } = request.body;

      const existing = await Media.findOne({ apiId, type, userId: session.user.id, });

      if (existing) {
        return response.status(409).json({ message: "Already exists" });
      }

      const newMedia = await Media.create({
        userId: session.user.id,
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
