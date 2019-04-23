import { model, Schema, Types } from 'mongoose';

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
    unique: true,
  },
  pages: {
    type: Number,
    min: 1,
  },
  numberOfBooks: {
    type: Number,
    min: 1,
  },
  borrowUsernames: {
    type: [String],
    default: [],
  },
});

// db.books.createIndex( { name: "text" }, { default_language: "french" } )
// Création de l'index pour la recherche de titre

export default model('Book', schema);