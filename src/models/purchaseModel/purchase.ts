import mongoose, { Schema } from 'mongoose';

const PurchaseSchema = new Schema({
  promptId: {
    type: Schema.Types.ObjectId,
    ref: 'Prompt',
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  stripeSessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
