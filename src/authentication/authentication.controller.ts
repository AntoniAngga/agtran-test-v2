import * as express from 'express';
import * as bcrypt from 'bcrypt';
import Controller from '../interfaces/controller.interfaces';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserRegisterDto from './userRegister.dto';
import LogInDto from './logIn.dto';
import { getRepository } from 'typeorm';
import User from '../users/user.entity';
import HttpException from '../exceptions/HttpException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import ChangePasswordDto from './ChangePassword.dto';
import NotFoundException from '../exceptions/NotFoundException';

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
      validationMiddleware(CreateUserRegisterDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.loggingIn
    );
    this.router.post(
      `${this.path}/:userId/changepassword`,
      validationMiddleware(ChangePasswordDto, true),
      this.changePassword
    );
  }

  private registration = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserRegisterDto = req.body;
    try {
      const hashesPassword = await bcrypt.hash(userData.password, 10);
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

  private changePassword = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.userId;
    const changePasswordData: ChangePasswordDto = req.body;
    const user = await this.userRepository.findOne(id);
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        changePasswordData.oldPassword,
        user.password
      );
      if (isPasswordMatching) {
        const hashesPassword = await bcrypt.hash(
          changePasswordData.newPassword,
          10
        );
        await this.userRepository.update(id, { password: hashesPassword });
        user.password = undefined;
        res.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new NotFoundException('404', 'User'));
    }
  };
}

export default AuthenticationController;
