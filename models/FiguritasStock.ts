import mongoose from 'mongoose';

const FiguritasStockSchema = new mongoose.Schema({
  packId: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
});

export default mongoose.models.FiguritasStock || mongoose.model('FiguritasStock', FiguritasStockSchema);
