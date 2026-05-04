import dbConnect from "@/db/connect";
import Media from "@/db/models/Media";

export default async function handler(request, response) {
  await dbConnect();

  const { id, commentId } = request.query;

  const media = await Media.findOne({ apiId: String(id) });

  if (!media) {
    return response.status(404).json({ message: "Media not found" });
  }

  const comment = media.comments.find(
    (comment) => comment._id.toString() === commentId
  );

  if (!comment) {
    return response.status(404).json({ message: "Comment not found" });
  }

  if (request.method === "PATCH") {
    const { text, action } = request.body;

    if (action === "like") {
      comment.likes += 1;
    }

    if (text) {
      comment.text = text;
    }

    await media.save();

    return response.status(200).json(media.comments);
  }

  if (request.method === "DELETE") {
    media.comments = media.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await media.save();

    return response.status(200).json(media.comments);
  }
}
