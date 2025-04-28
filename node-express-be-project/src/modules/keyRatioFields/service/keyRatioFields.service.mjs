import KeyRatioField from '../model/keyRatioFields.model.mjs';
import CalculatedRatios from '../model/calculatedRatios.models.mjs';
import { Project } from '../../../modules/project/model/project.model.mjs';
import { KeyCalField } from "../model/keyCalculatedRatio.model.mjs";
import { ValidationError } from '../../../utils/errorHandler.mjs';

export class KeyRatioFieldService {

    async getKeyRatioFieldById(project_id, user_id) {
        try {
            // Fetch Key Ratio Fields for the given project ID
            const keyRatioFields = await KeyRatioField.findAll({
                where: { project_id, user_id: user_id }
            });

            if (!keyRatioFields.length) {
                throw new Error(`No key ratio fields found for project_id: ${project_id}`);
            }

            // Fetch Calculated Ratios for the given project ID
            const calculatedRatios = await CalculatedRatios.findAll({
                where: { project_id }
            });

            // Structure the response
            const responseData = {
                project_id,
                keyRatioFields,
                calculatedRatios
            };

            return { data: responseData };

        } catch (error) {
            console.error("Error fetching key ratio data:", error);
            throw new Error(error.message);
        }
    }


    async getCompleteKeyRatioData(queryParams, user_id) {
        try {
            const { project_id } = queryParams;

            // Step 1: Validate if project_id exists in `Project` and belongs to the user
            let projectExists = false;
            if (project_id) {
                const project = await Project.findOne({ where: { id: project_id } });

                if (!project || project.userId !== user_id.userId) {
                    return { message: "No data found, unauthorized access!" };
                }
                console.log("project_id", project_id);
                projectExists = true;
            }

            // Step 2: Fetch all KeyCalFields
            const keyCalFields = await KeyCalField.findAll();


            // Step 3: Fetch KeyRatioFields & CalculatedRatios only if project_id exists
            let keyRatioFields = [];
            let calculatedRatios = [];
            if (projectExists) {
                keyRatioFields = await KeyRatioField.findAll({ where: { project_id } });

                calculatedRatios = await CalculatedRatios.findAll({
                    where: { project_id, user_id: user_id.userId }
                });
            }

            // Convert calculatedRatios into a Map for quick lookup
            const calculatedRatiosMap = calculatedRatios.reduce((acc, ratio) => {
                acc[ratio.field_id] = {
                    value: ratio.field_value,
                    is_flag: ratio.is_flag,
                    remark: ratio.remark
                };
                return acc;
            }, {});

            // Step 4: Format KeyRatioFields with actual values from CalculatedRatios
            let keyRatioFieldsFormatted;
            if (keyRatioFields.length === 0) {
                // If no keyRatioFields exist, return an object with null values
                const keyRatioFieldAttributes = Object.keys(KeyRatioField.rawAttributes);
                keyRatioFieldsFormatted = [
                    Object.fromEntries(keyRatioFieldAttributes.map(field => [field, null]))
                ];
            } else {
                keyRatioFieldsFormatted = keyRatioFields.map(field => {
                    const fieldData = field.toJSON();
                    const calculatedData = calculatedRatiosMap[field.id] || {};

                    return {
                        ...fieldData,
                        value: calculatedData.value ?? null,
                        is_flag: calculatedData.is_flag ?? null,
                        remark: calculatedData.remark ?? null
                    };
                });
            }

            // Step 5: Group KeyCalFields by `type` and `section`, setting `null` values where applicable
            const keyCalFieldsFormatted = keyCalFields.reduce((acc, field) => {
                const type = field.type || "Uncategorized";
                const section = field.section || "Uncategorized";

                if (!acc[type]) acc[type] = {};
                if (!acc[type][section]) acc[type][section] = [];

                const calculatedData = calculatedRatiosMap[field.id] || {};

                acc[type][section].push({
                    id: field.id,
                    field_name: field.field_name,
                    type: field.type,
                    section: field.section,
                    mid_end: field.mid_end,
                    premium: field.premium,
                    premium_range: field.premium_range,
                    affluent: field.affluent,
                    dependecy_fields: field.dependency_fields,
                    value: calculatedData.value ?? null,
                    is_flag: calculatedData.is_flag ?? null,
                    remark: calculatedData.remark ?? null
                });

                return acc;
            }, {});

            return {
                keyRatioFields: keyRatioFieldsFormatted,
                keyCalFields: keyCalFieldsFormatted
            };
        }
        catch (error) {
            console.error("Error in getCompleteKeyRatioData:", error);
            throw new Error(error.message || "An unexpected error occurred");
        }
    }


    async createKeyRatioFieldDraft(data, transaction = null) {
        const [record, created] = await KeyRatioField.findOrCreate({
            where: {
                project_id: data.project_id,
                module_id: data.module_id
            },
            defaults: data,
            transaction
        });
    
        if (!created) {
            // Update existing record with new data
            await record.update(data, { transaction });
        }
    
        return record;
    }
    
    

    async createKeyRatioField(data, transaction = null) {
        return await KeyRatioField.create(data, { transaction });
    }

    async updateKeyRatioField(project_id, user_id, data) {
        try {
            console.log(user_id, ": user_id")
            if (isNaN(project_id)) {
                throw new Error("Invalid project_id: must be a number");
            }

            // Step 1: Check if the project belongs to the logged-in user
            const project = await Project.findOne({ where: { id: project_id, user_id } });
            if (!project) {
                throw new Error(`Unauthorized: The project does not belong to the logged-in user (user_id: ${user_id})`);
            }

            // Ensure the project belongs to the user before updating
            const existingRecord = await KeyRatioField.findOne({ where: { project_id } });

            if (!existingRecord) {
                throw new Error(`No key ratio fields found for project_id: ${project_id} and user_id: ${user_id}`);
            }

            // Extract main fields and inputValues array
            const { inputValues, ...keyRatioData } = data;

            // Update Key Ratio Fields
            await KeyRatioField.update(keyRatioData, { where: { project_id } });

            // Update or Create Calculated Ratios (Loop through inputValues)
            if (inputValues && Array.isArray(inputValues)) {
                for (const input of inputValues) {
                    const { field_id, field_value, remark, flag: is_flag } = input;

                    const existingField = await CalculatedRatios.findOne({
                        where: { project_id, field_id }
                    });

                    if (existingField) {
                        // If field_id exists, update it
                        await CalculatedRatios.update(
                            { field_value, remark, is_flag },
                            { where: { project_id, field_id } }
                        );
                    } else {
                        // If field_id does not exist, create a new record
                        await CalculatedRatios.create({
                            user_id,
                            project_id,
                            field_id,
                            field_value,
                            remark,
                            is_flag
                        });
                    }
                }
            }

            // Fetch updated records
            const updatedKeyRatioFields = await KeyRatioField.findAll({ where: { project_id } });
            const updatedCalculatedRatios = await CalculatedRatios.findAll({ where: { project_id } });

            return {
                project_id,
                updatedKeyRatioFields,
                updatedCalculatedRatios
            };
        } catch (error) {
            console.error("Error updating key ratio data:", error);
            throw new Error(error.message);
        }
    }

    async saveAsDraft(userId, projectId, calculatedValues) {
        try {
            const savedData = [];
    
            for (const data of calculatedValues) {
                const [record, created] = await CalculatedRatios.findOrCreate({
                    where: {
                        project_id: projectId,
                        field_id: data.field_id
                    },
                    defaults: {
                        user_id: userId,
                        field_value: data.field_value,
                        remark: data.remark || null,
                        is_flag: data.flag || false
                    }
                });
    
                if (!created) {
                    await record.update({
                        user_id: userId,
                        field_value: data.field_value,
                        remark: data.remark || null,
                        is_flag: data.flag || false
                    });
                }
    
                savedData.push(record);
            }
    
            return savedData;
        } catch (error) {
            console.error("Error in saveAsDraft:", error);
            throw new Error("Failed to save calculated ratios");
        }
    }
    
    async saveCalculatedRatios(userId, projectId, calculatedValues, transaction = null) {
        try {
            console.log("====================")
            // 1. Get the project's category
            const project = await Project.findOne({
                where: { id: projectId },
                attributes: ['category']
            });
            console.log(project, ":project")
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }

            const projectCategory = project.category?.toLowerCase();
            const allowedCategories = ['mid-end', 'premium', 'affluent'];
            if (!allowedCategories.includes(projectCategory)) {
                throw new Error(`Invalid project category: ${projectCategory}`);
            }

            // 2. Fetch all ratio field configs
            const allFieldConfigs = await KeyCalField.findAll({
                attributes: ['id', 'field_name', 'mid_end', 'premium', 'affluent'],
            });
            console.log(allFieldConfigs, ": allFieldConfigs")

            const fieldRangeMap = new Map();
            for (const field of allFieldConfigs) {
                fieldRangeMap.set(field.id, {
                    name: field.field_name,
                    mid_end: field.mid_end,
                    premium: field.premium,
                    affluent: field.affluent,
                });
            }

            // 3. Validate inputs
            const calculatedData = [];

            for (const data of calculatedValues) {
                const { field_id, field_value, remark, flag } = data;
                const field = fieldRangeMap.get(field_id);

                if (!field) {
                    throw new ValidationError(`Field config not found for field_id: ${field_id}`);
                }

                const rangeString = field[projectCategory.replace('-', '_')]; // e.g., field.mid_end

                if (!rangeString || !rangeString.includes('-')) {
                    throw new ValidationError(`Invalid or missing range for field "${field.name}" and category "${projectCategory}"`);
                }

                const [min, max] = rangeString.split('-').map(Number);

                if (isNaN(min) || isNaN(max)) {
                    throw new ValidationError(`Corrupt range format in DB for field "${field.name}"`);
                }

                if ((field_value < min || field_value > max) && (!remark || remark.trim() === "")) {
                    throw new ValidationError(
                        `Value for "${field.name}" must be between ${min} and ${max} for category "${projectCategory}". You provided: ${field_value}`,
                        400,
                        'FIELD_VALIDATION_ERROR'
                    );
                }

                calculatedData.push({
                    user_id: userId,
                    project_id: projectId,
                    field_id,
                    field_value,
                    remark: remark || null,
                    is_flag: flag || false,
                });
            }

            // 4. Save valid values
            const savedData = await CalculatedRatios.bulkCreate(calculatedData, { transaction });
            return savedData;

        } catch (error) {
            console.error("Validation or save error:", error.message);
            if (error instanceof ValidationError) {
                throw error;
            }
        }
    }
}
