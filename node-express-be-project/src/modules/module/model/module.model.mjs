import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';
import { ProjectTypeEnum, StatusEnum } from '../../../utils/enums.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class Module extends Model { }

Module.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM(...ProjectTypeEnum),
        allowNull: false,
    },
    moduleNumber: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    parameters: {
        type: DataTypes.BIGINT.UNSIGNED,
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
    modelName: 'Module',
    tableName: 'modules',
    timestamps: true,
    underscored: true
});
