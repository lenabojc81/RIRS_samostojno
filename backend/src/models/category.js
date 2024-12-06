import mongoose, {Schema, Document} from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true },
});

export default mongoose.model('Category', categorySchema);