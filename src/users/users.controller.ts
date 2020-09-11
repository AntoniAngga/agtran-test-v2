import * as express from 'express';
import Controller from '../interfaces/controller.interfaces';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from './user.dto';
import { getRepository } from 'typeorm';
import User from './user.entity';
import HttpException from '../exceptions/HttpException';
import NotFoundException from '../exceptions/NotFoundException';

class UsersController implements Controller {
  public path = '/users';
  public router = express.Router();
  private userRepository = getRepository(User);

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.findAll);
    this.router.get(this.path + '/:id', this.findOne);
    this.router.put(
      this.path + '/:id',
      validationMiddleware(CreateUserDto, true),
      this.update
    );
    this.router.delete(this.path + '/:id', this.delete);
  }

  private findAll = async (req: express.Request, res: express.Response) => {
    const users = await this.userRepository.find();
    res.send(users);
  };

  private findOne = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const user = await this.userRepository.findOne(id);
    if (user) {
      res.send(user);
    } else {
      next(new NotFoundException(id, 'User'));
    }
  };

  // private create = async (
  //   req: express.Request,
  //   res: express.Response,
  //   next: express.NextFunction
  // ) => {
  //   const userData: CreateUserDto = req.body;
  //   try {
  //     const newUser = this.userRepository.create(userData);
  //     await this.userRepository.save(newUser);
  //     res.send(newUser);
  //   } catch (err) {
  //     next(new HttpException(500, err.detail));
  //   }
  // };

  private delete = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const user = await this.userRepository.delete(id);
    if (user.affected != 0) {
      res.send(user);
    } else {
      next(new NotFoundException(id, 'User'));
    }
  };

  private update = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const userData: User = req.body;
    try {
      await this.userRepository.update(id, userData);
      const updatedUser = await this.userRepository.findOne(id);
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(new NotFoundException(id, 'User'));
      }
    } catch (err) {
      next(new HttpException(500, err.detail));
    }
  };
}

export default UsersController;
