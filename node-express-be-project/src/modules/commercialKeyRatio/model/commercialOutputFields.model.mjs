import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class CommercialOutputField extends Model {}

CommercialOutputField.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    field_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dependency: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    range: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'range',
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
    modelName: 'CommercialOutputField',
    tableName: 'commercial_output_fields',
    timestamps: true,
    underscored: true,
  }
);

export default CommercialOutputField;
