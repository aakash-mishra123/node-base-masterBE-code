import Joi from 'joi';

// Define a common error message
const requiredMessage = 'Field name is required';
const typeMessage = 'Field name must be a number';

// Define a common Joi validation pattern for number fields
const numberRequiredValidation = Joi.number().required().messages({
  'any.required': requiredMessage,
  'number.base': typeMessage,
});

// Array of field names that need the same validation
const fields = [
  'project_id', 'module_id', 'building_height', 'carpet_area', 'saleable_area',
  'balcony_area', 'built_up_area', 'far', 'total_external_wall_area', 'total_basement_area',
  'circulation_area', 'service_shaft_area', 'window_to_area_ratio', 'drive_away_width_basement',
  'total_steel_reinforcement', 'total_concrete_consumption', 'air_conditioned_area',
  'apartment_area', 'club_area', 'total_parking_area', 'total_number_of_cars', 'lobby_corridor_width',
  'drive_away_width', 'floor_to_floor_height_ground_lobby', 'floor_to_floor_height_basement_b1_b2',
  'floor_to_floor_height_apt', 'car_length', 'car_width', 'passenger_lift_speed', 'service_lift_speed',
  'avg_waiting_time',
];

// Dynamically create the Joi schema based on the field names
const createKeyRatioFieldSchema = Joi.object(
  fields.reduce((schema, field) => {
    schema[field] = numberRequiredValidation;
    return schema;
  }, {})
);

export { createKeyRatioFieldSchema };
