import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class CommercialKeyRatio extends Model {}

CommercialKeyRatio.init(
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
    sub_category: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    modelName: 'CommercialKeyRatio',
    tableName: 'commercial_key_ratio',
    timestamps: true,
    underscored: true,
  }
);

export default CommercialKeyRatio;
