import { Sequelize } from 'sequelize';
import { MYSQL_DATABASE_NAME, MYSQL_PASSWORD, MYSQL_USERNAME } from '../config/index.mjs';

class Database {
    constructor({ database, username, password, host, dialect, poolOptions = {} }) {
        this.database = database;
        this.username = username;
        this.password = password;
        this.host = host;
        this.dialect = dialect;
        this.poolOptions = poolOptions;

        this.sequelize = new Sequelize(database, username, password, {
            host,
            dialect,
            logging: false,
            pool: poolOptions,
        });
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('DB Connection established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.sequelize.close();
            console.log('Connection has been closed.');
        }
        catch (error) {
            console.error('Unable to close the database connection:', error);
        }
    }

    async sync(options = {}) {
        try {
            await this.sequelize.sync(options);
            console.log('Database synchronized successfully.');
        }
        catch (error) {
            console.error('Error synchronizing the database:', error);
            throw error;
        }
    }

    getSequelize() {
        return this.sequelize;
    }
}

const config = {
    database: MYSQL_DATABASE_NAME,
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    poolOptions: {
        max: parseInt(process.env.MYSQL_POOL_MAX) || 5,
        min: parseInt(process.env.MYSQL_POOL_MIN) || 0,
        acquire: parseInt(process.env.MYSQL_POOL_ACQUIRE) || 30000,
        idle: parseInt(process.env.MYSQL_POOL_IDLE) || 10000,
    },
};

export const MySQLDatabase = new Database(config);

export const sequelize = MySQLDatabase.getSequelize();