import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  bookId: { type: String, required: true }, // ✅ STRING (fix NaN issue)
  title: String,
  subtitle: String,
  image: String,
  price: Number,
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  items: [cartItemSchema],
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);