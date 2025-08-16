import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: { type: String, enum: ['bkash', 'nagad'], required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['success', 'failed'], default: 'success' }, // simulate
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
