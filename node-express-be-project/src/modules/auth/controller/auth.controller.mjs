import { AuthService } from '../service/auth.service.mjs';
import { ErrorHandler } from '../../../utils/errorHandler.mjs';
import { ResponseHandler } from '../../../utils/responseHandler.mjs';

export class AuthController {
    constructor() {
        this.authService = new AuthService();

        this.login = this.login.bind(this);
        this.me = this.me.bind(this);
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return ErrorHandler.sendError({
                    res,
                    errorCode: 'BAD_REQUEST',
                    statusCode: 400,
                    message: 'Email and password are required',
                });
            }

            const response = await this.authService.login(email, password);

            return res.status(200).json({ success: true, data: response });
        }
        catch (error) {
            next(error);
        }
    }


    async me(req, res, next) {
        try {
            const userId = req.user.userId;
            const user = await this.authService.me(userId);
            return ResponseHandler.sendResponse(res, true, user);
        }
        catch (error) {
            next(error);
        }
    }
}
