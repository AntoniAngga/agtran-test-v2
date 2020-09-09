import App from './app';
import UsersController from './users/users.controller';

const app = new App([new UsersController()], 5000);

app.listen();
