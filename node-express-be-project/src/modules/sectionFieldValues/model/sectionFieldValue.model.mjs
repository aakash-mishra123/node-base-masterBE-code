import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class SectionFieldValue extends Model { }

SectionFieldValue.init(
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
        chapterId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        sectionId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        sectionFieldId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        answer: {
            type: DataTypes.JSON, // We might have to single/multiple string values
            allowNull: false,
        },
        remark: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        anyOtherAnswer: {
            type: DataTypes.STRING(255), // to store the answer for anyother
            allowNull: true,
        },
        isFlaged: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]],
            },
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
        modelName: 'SectionFieldValue',
        tableName: 'section_field_values',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['projectId', 'sectionFieldId'],
                name: 'unique_project_field'
            }
        ]
    }
);

export default SectionFieldValue;
