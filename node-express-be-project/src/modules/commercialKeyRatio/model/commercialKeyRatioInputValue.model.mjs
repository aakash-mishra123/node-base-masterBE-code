import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';
import CommercialKeyRatio from './commercialKeyRatio.model.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class CommercialKeyRatioInputValue extends Model {}

CommercialKeyRatioInputValue.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    field_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: CommercialKeyRatio,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    value: {
      type: DataTypes.STRING(255),
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
    modelName: 'CommercialKeyRatioInputValue',
    tableName: 'commercial_key_ratio_input_values',
    timestamps: true,
    underscored: true,
  }
);

export default CommercialKeyRatioInputValue;
