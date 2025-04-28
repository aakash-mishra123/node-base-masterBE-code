import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';
import { StatusEnum } from '../../../utils/enums.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class Section extends Model { }

Section.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    chapterId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    modelName: 'Section',
    tableName: 'sections',
    timestamps: true,
    underscored: true
});
