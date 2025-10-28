// models/purchaseModel/purchase.ts
import mongoose, { Schema, model, models } from "mongoose";

const purchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  promptId: { type: Schema.Types.ObjectId, ref: "Prompt", required: true },
  paymentDetails: { type: Object },
  purchasedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Purchase = models.Purchase || model("Purchase", purchaseSchema);

export default Purchase;