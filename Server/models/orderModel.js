import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", OrderSchema);
