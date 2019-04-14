import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config()

// Valide le schéma des variables d'environnement, pour s'assurer que nous n'avons pas de variables undefined.
const envSchema = joi.object({
  MONGO_USER: joi.string().required(),
  MONGO_PASSWORD: joi.string().required(),
  MONGO_HOST: joi.string().required(),
  MONGO_PORT: joi.number().default(3306),
  MONGO_DATABASE: joi.string().required(),
  MONGO_COLLECTION_USERS: joi.string().required(),
  MONGO_COLLECTION_BOOKS: joi.string().required(),
  MONGO_COLLECTION_BORROWS: joi.string().required(),
}).unknown().required();

const { error, value: vars } = joi.validate(process.env, envSchema);

if (error) {
  console.log(`Config validation errors, please check the .env file: ${error.message}`);
}

// Export des variables d'environement pour 
export default {
  mongo: {
    host: vars.MONGO_HOST as string,
    port: vars.MONGO_PORT as string,
    user: vars.MONGO_USER as string,
    password: vars.MONGO_PASSWORD as string,
    database: vars.MONGO_DATABASE as string,
    usersCollection: vars.MONGO_COLLECTION_USERS as string,
    booksCollection: vars.MONGO_COLLECTION_BOOKS as string,
    borrowsCollection: vars.MONGO_COLLECTION_BORROWS as string,
    uri: `mongodb://${vars.MONGO_USER}:${vars.MONGO_PASSWORD}@${vars.MONGO_HOST}:${vars.MONGO_PORT}/${vars.MONGO_DATABASE}`,
  },
}
