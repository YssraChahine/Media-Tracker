import dbConnect from "@/db/connect";
import Media from "@/db/models/Media";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  if (request.method === "PATCH") {
    try {
      const { status } = request.body;
      const updatedMedia = await Media.findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
        }
      );
      if (!updatedMedia) {
        return response.status(404).json({ message: "Media not found" });
      }
      return response.status(200).json(updatedMedia);
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
  if (request.method === "DELETE") {
    try {
      await Media.findByIdAndDelete(id);
      return response.status(200).json({ message: "Deleted" });
    } catch (error) {
      return response.status(400).json({ error: "Delete failed" });
    }
  }
  return response.status(405).json({ message: "Method not allowed" });
}
