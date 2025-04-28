import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';
import { StatusEnum } from '../../../utils/enums.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class ProjectModule extends Model { }

ProjectModule.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        projectId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        moduleId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        allParams: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        deviations: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        benchmarkParams: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        flags: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        complianceScore: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        moduleStatus: {
            type: DataTypes.FLOAT(5, 2), // Float value between 0 to 1 (percentage progress of a module)
            allowNull: false,
            defaultValue: 0.0,
            validate: { min: 0, max: 1 },
        },
        completedChapters: {
            type: DataTypes.BIGINT.UNSIGNED, // (Number of chapters completed for this module of this project)
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM(...StatusEnum),
            defaultValue: 'pending',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updated_at',
        },
    },
    {
        sequelize,
        modelName: 'ProjectModule',
        tableName: 'project_modules',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['projectId', 'moduleId'],
                name: 'unique_project_module'
            }
        ]
    }
);

export default ProjectModule;
