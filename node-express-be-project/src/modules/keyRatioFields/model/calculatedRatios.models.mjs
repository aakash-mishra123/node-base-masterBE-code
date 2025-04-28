import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';
import User from "../../auth/model/user.model.mjs";
import { Project } from "../../project/model/project.model.mjs";
import { KeyCalField } from "../model/keyCalculatedRatio.model.mjs";


const sequelize = MySQLDatabase.getSequelize();

export class CalculatedRatios extends Model { }

CalculatedRatios.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    field_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: KeyCalField,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    field_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'field_value',
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'remark',
    },
    is_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'is_flag',
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
    modelName: 'CalculatedRatios',
    tableName: 'calculated_ratios',
    timestamps: true,
    underscored: true,
  }
);

export default CalculatedRatios;
