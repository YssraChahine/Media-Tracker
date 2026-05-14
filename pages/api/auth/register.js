import bcrypt from "bcryptjs";
import dbConnect from "@/db/connect";
import User from "@/db/models/User";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method !== "POST") {
    return response.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return response.status(201).json({
      message: "User created",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Something went wrong",
    });
  }
}
