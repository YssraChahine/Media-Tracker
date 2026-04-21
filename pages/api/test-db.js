import dbConnect from "@/db/connect";

export default async function handler(request, response) {
  try {
    await dbConnect();
    response.status(200).json({ message: "DB connected successfully" });
  } catch (error) {
    response.status(500).json({ error: "DB connection failed" });
  }
}
