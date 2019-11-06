import { model, Schema } from 'mongoose';
import { ObjectID } from 'bson';

const schema = new Schema({
  name: {
    type: String,
  },
  author: {
    type: String,
  },
  publisher: {
    type: String,
  },
  publicationDate: {
    type: Date,
  },
  coverUrl: {
    type: String,
    required: false,
  },
  isbn: {
    type: String,
  },
  pages: {
    type: Number,
    min: 1,
  },
  description: {
    type: String,
    required: false,
  },
  borrowUsername: {
    type: String,
    required: false,
  },
  libraryId: {
    type: ObjectID,
  }
});

schema.index({ name: "text" }, { default_language: "french" });

export default model('Book', schema);