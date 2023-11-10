import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    productId: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
    buyer: {
      type: mongoose.ObjectId,
      required: true,
    },
    payment: {},
    status: {
      type: String,
      enum: ["On the way", "Delivered", "Cancelled", "Returned"],
      default: "On the way",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", OrderSchema);
