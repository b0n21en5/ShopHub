import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    productId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "products",
      },
    ],
    buyer: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    payment: {},
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", OrderSchema);
