import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

class App {
  public app: express.Application;
  public port: number;
  private url: string = '/api/v1';

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use(this.url, controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
