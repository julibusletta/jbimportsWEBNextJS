import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  isMain: { type: Boolean, default: false },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
