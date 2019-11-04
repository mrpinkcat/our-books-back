import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config()

// Valide le schéma des variables d'environnement, pour s'assurer que nous n'avons pas de variables undefined.
const envSchema = joi.object({
  MONGO_USER: joi.string().required(),
  MONGO_PASSWORD: joi.string().required(),
  MONGO_HOST: joi.string().required(),
  MONGO_PORT: joi.number().integer().default(27017),
  MONGO_DATABASE: joi.string().required(),
  BCRYPT_SALTROUNDS: joi.number().positive().integer().default(10),
  GEO_API_KEY: joi.string().required(),
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
    uri: `mongodb://${vars.MONGO_USER}:${vars.MONGO_PASSWORD}@${vars.MONGO_HOST}:${vars.MONGO_PORT}/${vars.MONGO_DATABASE}`,
  },
  bcrypt: {
    saltRounds: vars.BCRYPT_SALTROUNDS as string,
  },
  geocode: vars.GEO_API_KEY as string,
}
