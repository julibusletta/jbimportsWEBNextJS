import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  dateStr: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Format: YYYY-MM-DD
  count: { 
    type: Number, 
    default: 0 
  }
});

const VisitModel = mongoose.models.Visit || mongoose.model('Visit', VisitSchema);

export default VisitModel;
