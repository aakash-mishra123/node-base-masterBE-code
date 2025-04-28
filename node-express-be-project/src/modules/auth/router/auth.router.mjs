import express from 'express';
import { AuthController } from '../controller/auth.controller.mjs';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';

class AuthRouter {
  constructor() {
    this.router = express.Router();
    this.authController = new AuthController();
    this._initializeRoutes();
  }

  _initializeRoutes() {
   
    this.router.post('/login', this.authController.login);
    this.router.get('/me', JwtHelper.verifyToken, this.authController.me);
  }
}

export default new AuthRouter().router;
