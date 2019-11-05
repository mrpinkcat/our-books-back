import { model, Schema } from 'mongoose';

const schema = new Schema({
  name: {
    unique: true,
    type: String,
    required: true,
  },
  books: {
    unique: true,
    type: [String],
    required: true,
  },
});

export default model('Author', schema);
