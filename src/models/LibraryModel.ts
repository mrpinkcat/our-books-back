import { model, Schema } from 'mongoose';

const schema = new Schema({
  name: {
    unique: true,
    type: String,
    required: true,
    minlength: 3,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    code: Number,
  },
});

export default model('Library', schema);
