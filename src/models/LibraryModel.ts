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
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: false,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  }
});

export default model('Library', schema);
