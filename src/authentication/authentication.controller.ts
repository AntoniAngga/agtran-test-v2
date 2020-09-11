import * as express from 'express';
import * as bcrypt from 'bcrypt';
import Controller from '../interfaces/controller.interfaces';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserRegisterDto from './userRegister.dto';
import LogInDto from '../authentication/LogIn.dto';
import { getRepository } from 'typeorm';
import User from '../users/user.entity';
import HttpException from '../exceptions/HttpException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import ChangePasswordDto from '../authentication/ChangePassword.dto';
import NotFoundException from '../exceptions/NotFoundException';
import { google } from 'googleapis';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private userRepository = getRepository(User);
  private auth = false;

  constructor() {
    this.intializeRoutes();
  }

  private oauth2Client = new google.auth.OAuth2(
    '860169947421-h4r1p8r204cs7b2oio9gvhkogr53e3ol.apps.googleusercontent.com',
    'OUJyiJVZeDHEOpjCS0FOEKDQ',
    'http://localhost:5000/api/v1/auth/google/callback'
  );

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
    this.router.get(`${this.path}/login`, this.view_oauth);
    this.router.get(`${this.path}/logout`, this.logout);
    this.router.get(`${this.path}/google/callback`, this.callback_google);
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

  private callback_google = async (
    req: express.Request,
    res: express.Response
  ) => {
    if (req.query.code) {
      const { tokens } = await this.oauth2Client.getToken(
        req.query.code.toString()
      );
      this.oauth2Client.setCredentials(tokens);
      this.auth = true;
    }
    res.redirect('/api/v1/auth/login');
  };

  private view_oauth = async (req: express.Request, res: express.Response) => {
    if (this.auth) {
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const userInfo = await oauth2.userinfo.v2.me.get();
      console.log(userInfo);
      res.render('index', {
        button: 'Sign out',
        url: '/api/v1/auth/logout',
        userInfo: userInfo.data,
      });
    } else {
      const redirectUrl = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['email', 'profile'],
      });
      res.render('index', {
        button: 'Sign In',
        url: redirectUrl,
        userInfo: null,
      });
    }
  };

  private logout = async (req: express.Request, res: express.Response) => {
    try {
      await this.oauth2Client.revokeCredentials();
      this.auth = false;
      res.redirect('/api/v1/auth/login');
    } catch (err) {
      res.redirect('/api/v1/auth/login');
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
