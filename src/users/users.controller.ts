import * as express from 'express';
import User from './user.interface';
import Controller from '../../interfaces/controller.interfaces';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from './user.dto';

class UsersController implements Controller {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.findAll);
    this.router.post(
      this.path,
      validationMiddleware(CreateUserDto),
      this.create
    );
    this.router.get(this.path + '/:id', this.findOne);
    this.router.put(
      this.path + '/:id',
      validationMiddleware(CreateUserDto, true),
      this.update
    );
    this.router.delete(this.path + '/:id', this.delete);
  }

  private findAll = (req: express.Request, res: express.Response) => {
    res.send('all Users is here');
  };

  private findOne = (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const data: User = req.body;
    res.send('User is here');
  };

  private create = (req: express.Request, res: express.Response) => {
    const data: User = req.body;
    res.send('create User is Here');
  };

  private delete = (req: express.Request, res: express.Response) => {
    res.send('Delete user is here');
  };

  private update = (req: express.Request, res: express.Response) => {
    res.send('Update user is here');
  };
}

export default UsersController;
