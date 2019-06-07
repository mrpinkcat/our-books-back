import { model, Schema } from 'mongoose';

const schema = new Schema({
  username: {
    unique: true,
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  birthDate: {
    type: Date,
    required: false,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  rank: {
    type: String,
    required: false,
    default: 'user',
  }
});

export default model('User', schema);
