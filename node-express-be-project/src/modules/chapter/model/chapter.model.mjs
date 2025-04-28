import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';
import { StatusEnum } from '../../../utils/enums.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class Chapter extends Model { }

Chapter.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    moduleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    chapterNumber: {
        type: DataTypes.INTEGER,
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
    modelName: 'Chapter',
    tableName: 'chapters',
    timestamps: true,
    underscored: true
});
