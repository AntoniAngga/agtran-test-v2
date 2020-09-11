import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import Controller from './interfaces/controller.interfaces';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;
  public port: number;
  private url: string = '/api/v1';

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeViews();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(this.url, controller.router);
    });
  }

  private initializeViews() {
    this.app.set('views', 'src/views');
    this.app.set('view engine', 'ejs');
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
