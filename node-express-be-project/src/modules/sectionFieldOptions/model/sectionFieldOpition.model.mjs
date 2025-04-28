import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class SectionFieldOption extends Model { }

SectionFieldOption.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        sectionId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        sectionFieldId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        chapterId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        moduleId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        fieldOption: {
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
    },
    {
        sequelize,
        modelName: 'SectionFieldOption',
        tableName: 'section_field_options',
        timestamps: true,
        underscored: true,
    }
);

export default SectionFieldOption;
