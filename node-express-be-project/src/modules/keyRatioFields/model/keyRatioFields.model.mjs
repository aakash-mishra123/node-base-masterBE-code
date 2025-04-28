import { DataTypes, Model } from 'sequelize';
import { MySQLDatabase } from '../../../db/connection.mjs';

const sequelize = MySQLDatabase.getSequelize();

export class KeyRatioField extends Model {}

KeyRatioField.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
      field: 'project_id',
    },
    module_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'modules',
        key: 'id',
      },
      onDelete: 'CASCADE',
      field: 'module_id',
    },
    building_height: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    carpet_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    saleable_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    balcony_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    built_up_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    far: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    total_external_wall_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    total_basement_area: {type: DataTypes.DECIMAL(10, 2), allowNull: true},
    circulation_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    service_shaft_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    window_to_area_ratio: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // drive_away_width_basement: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    total_steel_reinforcement: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    total_concrete_consumption: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    air_conditioned_area_for_appartment: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    tonnage_per_appartment: { type: DataTypes.INTEGER, allowNull: true },
    air_conditioned_area_for_club: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    tonnage_of_club_house: { type: DataTypes.INTEGER, allowNull: true },
    // apartment_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // club_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    total_parking_area: { type: DataTypes.DECIMAL(10, 2), allowNull: true},
    total_number_of_cars: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    lobby_corridor_width: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    driveway_width_basement: { type: DataTypes.DECIMAL(10, 2), allowNull: true },      
    floor_to_floor_height_ground_lobby: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    floor_to_floor_height_basement_b1_b2: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    floor_to_floor_height_apt: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    car_length: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    car_width: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    clear_height: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // parking_bay_size: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // basement_parking_efficiency: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // circulation_efficiency: { type: DataTypes.DECIMAL(10, 2), allowNull: true},
    // steel_consumption: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // concrete_consumption: { type: DataTypes.DECIMAL(10, 2), allowNull: true},
    // service_core_efficiency: { type: DataTypes.DECIMAL(10, 2), allowNull: true},
    passenger_lift_speed: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    service_lift_speed: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    avg_waiting_time: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // overall_cooling_efficiency_apt: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // overall_cooling_efficiency_club: { type: DataTypes.DECIMAL(10, 2), allowNull: true},
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
    modelName: 'KeyRatioField',
    tableName: 'key_ratio_fields',
    timestamps: true,
    underscored: true,
  }
);

export default KeyRatioField;
