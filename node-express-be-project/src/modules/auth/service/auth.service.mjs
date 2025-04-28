import bcrypt from 'bcrypt';
import { JwtHelper } from '../../../middlewares/jwtHelper.mjs';
import { AppError } from '../../../utils/errorHandler.mjs';
import { User } from '../../index.model.mjs';
import { MySQLDatabase } from '../../../db/connection.mjs';

export class AuthService {
    constructor() {
        this.db = MySQLDatabase.getSequelize();
    }

    /**
     * Login a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User data and token
     */
    async login(email, password) {
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new AppError('NOT_FOUND', 404, 'User not found');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new AppError('BAD_REQUEST', 400, 'Invalid email or password');
            }

            // Generate JWT token
            const token = JwtHelper.signToken({ userId: user.id, email: email });

            return {
                accessToken: token
            };
        }
        catch (error) {
            throw error;
        }
    }

  
    /**
     * Verify and return logged-in user details
     * @param {string} userId - user id
     * @returns {Promise<Object>} User data
     */
    async me(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: ['id', 'email', 'phone', 'status', 'createdAt', 'updatedAt'],
            });

            if (!user) throw new AppError('NOT_FOUND', 404, 'User not found');
            return user;
        }
        catch (error) {
            throw error;
        }
    }

}
