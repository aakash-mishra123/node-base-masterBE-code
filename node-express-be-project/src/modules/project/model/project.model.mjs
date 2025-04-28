import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';
import { CategoryEnum, ProjectTypeEnum, StatusEnum } from '../../../utils/enums.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class Project extends Model { }

Project.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM(...CategoryEnum),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    projectType: {
        type: DataTypes.ENUM(...ProjectTypeEnum),
        allowNull: false,
    },
    projectOwner: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(...StatusEnum),
        defaultValue: 'pending',
    },
    isDeleted: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        validate: {
            isIn: [[0, 1]]
        }
    },
    userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    userEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    userNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    userDesignation: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
    },
}, {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
    underscored: true
});



