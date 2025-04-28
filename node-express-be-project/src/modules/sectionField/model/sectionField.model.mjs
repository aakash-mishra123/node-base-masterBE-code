import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';
import { FieldTypeEnum, StatusEnum } from '../../../utils/enums.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class SectionField extends Model { }

SectionField.init(
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
        fieldName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        fieldType: {
            type: DataTypes.ENUM(...FieldTypeEnum),
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
                isIn: [[0, 1]],
            },
        },
        midEndAns: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        affluentAns: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        premiumAns: {
            type: DataTypes.JSON,
            allowNull: true,
        },        
        inputValue: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        modelName: 'SectionField',
        tableName: 'section_fields',
        timestamps: true,
        underscored: true,
    }
);

export default SectionField;
