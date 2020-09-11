import * as express from 'express';
import * as bcrypt from 'bcrypt';
import Controller from '../interfaces/controller.interfaces';
import { getRepository } from 'typeorm';
import User from '../users/user.entity';
import { google } from 'googleapis';

class OauthController implements Controller {
  public path = '/oauth';
  public router = express.Router();
  private userRepository = getRepository(User);

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get('/', this.view_oauth);
  }

  private view_oauth(req: express.Request, res: express.Response) {
    console.log('Ke panggil');
    res.render('index');
  }
}

export default OauthController;
