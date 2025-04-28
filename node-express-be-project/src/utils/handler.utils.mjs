import _ from 'lodash';

/**
 * Exclude specified fields from Sequelize model results.
 * @param {Object|Array} data - Single object or array of objects.
 * @param {Array} fieldsToExclude - Fields to exclude.
 * @returns {Object|Array} Filtered object or array.
 */
export const excludeFields = (data, fieldsToExclude = ['createdAt', 'updatedAt', 'isDeleted']) => {
    if (Array.isArray(data)) {
        return data.map(item => _.omit(item.toJSON(), fieldsToExclude));
    }
    return _.omit(data.toJSON(), fieldsToExclude);
};


export const parseBoolean = (value) => value === 'true';