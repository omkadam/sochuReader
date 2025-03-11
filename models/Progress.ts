import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  progress: { type: Number, required: true },
});

export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
