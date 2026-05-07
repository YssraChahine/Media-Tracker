import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
  text: String,
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const mediaSchema = new Schema({
  apiId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["movie", "series"],
    required: true,
  },
  imageUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ["planned", "in progress", "completed"],
    default: "planned",
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  currentSeason: {
    type: Number,
    default: null,
  },
  currentEpisode: {
    type: Number,
    default: null,
  },
  comments: [commentSchema],
});

const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema);

export default Media;
