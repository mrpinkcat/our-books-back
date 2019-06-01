import { model, Schema } from 'mongoose';
import { ObjectID } from 'bson';

const schema = new Schema({
  name: {
    type: String,
  },
  authors: {
    type: [String],
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
  borrowUsername: {
    type: String,
    required: false,
  },
  libraryId: {
    type: ObjectID,
  }
});

// db.books.createIndex( { name: "text" }, { default_language: "french" } )
// Création de l'index pour la recherche de titre

export default model('Book', schema);