import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true }, // Slug of the category
  description: { type: String },
  stock: { type: Number, default: 0 },
  badge: { type: String },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
