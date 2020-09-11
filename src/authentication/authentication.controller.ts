import * as express from 'express';
import * as bcrypt from 'bcrypt';
import Controller from '../interfaces/controller.interfaces';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import LogInDto from './logIn.dto';
import { getRepository } from 'typeorm';
import User from '../users/user.entity';
import HttpException from '../exceptions/HttpException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private userRepository = getRepository(User);

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.loggingIn
    );
  }

  private registration = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = req.body;
    try {
      const hashesPassword = await bcrypt.hash(userData.password, 10);
      console.log(hashesPassword);
      const user = await this.userRepository.create({
        ...userData,
        password: hashesPassword,
      });
      await this.userRepository.save(user);
      res.send(user);
    } catch (err) {
      next(new HttpException(500, err.detail));
    }
  };

  private loggingIn = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDto = req.body;
    const user = await this.userRepository.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        res.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };
}

export default AuthenticationController;
