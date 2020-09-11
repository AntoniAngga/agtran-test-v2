import 'dotenv/config';
import App from './app';
import UsersController from './users/users.controller';
import AuthenticationController from './authentication/authentication.controller';
import { createConnection } from 'typeorm';
import * as config from './ormconfig';
import validateEnv from './utils/validateEnv';

validateEnv();

(async () => {
  try {
    const connection = await createConnection(config);
    await connection.runMigrations();
  } catch (error) {
    console.log('Error while connecting to the database', error);
    return error;
  }
  const app = new App(
    [new UsersController(), new AuthenticationController()],
    process.env.PORT
  );
  app.listen();
})();
