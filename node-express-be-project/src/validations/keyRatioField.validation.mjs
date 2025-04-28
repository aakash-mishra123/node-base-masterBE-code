import Joi from 'joi';

export const createKeyRatioFieldSchema = Joi.object({
  project_id: Joi.number().required().messages({
    'any.required': 'Project ID is required',
    'number.base': 'Project ID must be a number'
  }),
  module_id: Joi.number().required().messages({
    'any.required': 'Module ID is required',
    'number.base': 'Module ID must be a number'
  }),
  building_height: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  carpet_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  saleable_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  balcony_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  built_up_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  far: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  total_external_wall_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  total_basement_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  circulation_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  service_shaft_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  window_to_area_ratio: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  drive_away_width_basement: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  total_steel_reinforcement: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  total_concrete_consumption: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  air_conditioned_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  apartment_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),

  club_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  total_parking_area: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),


  total_number_of_cars: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  lobby_corridor_width: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  drive_away_width: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  floor_to_floor_height_ground_lobby: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  floor_to_floor_height_basement_b1_b2: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  floor_to_floor_height_apt: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  car_length: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  car_width: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),


  passenger_lift_speed: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  service_lift_speed: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  avg_waiting_time: Joi.number().required().messages({
    'any.required': 'Field name is required',
    'string.base': 'Field name must be a number'
  }),
  // formula: Joi.string().optional(),

  // inputValues: Joi.array().items(
  //   Joi.object({
  //     field_id: Joi.number().required().messages({
  //       'any.required': 'Field ID is required',
  //       'number.base': 'Field ID must be a number'
  //     }),
  //     value: Joi.number()
  //       .required()
  //       .min(0)         // 👈 Minimum value
  //       .max(10000)     // 👈 Maximum value
  //       .messages({
  //         'any.required': 'Value is required',
  //         'number.base': 'Value must be a number',
  //         'number.min': 'Value must be at least 0',
  //         'number.max': 'Value must not exceed 10000'
  //       })
  //   })
  // ).optional()
});
