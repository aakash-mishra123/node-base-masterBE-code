import { DataTypes, Model } from "sequelize";
import { MySQLDatabase } from "../../../db/connection.mjs";

const sequelize = MySQLDatabase.getSequelize();

export class KeyCalField extends Model { }

KeyCalField.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    module_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    field_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mid_end: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    premium: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    premium_range: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    affluent: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
    dependency_fields: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "KeyCalField",
    tableName: "key_cal_fields",
    timestamps: true,
    underscored: true,
  }
);

export default KeyCalField;
