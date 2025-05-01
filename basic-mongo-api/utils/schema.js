const Joi = require('joi');

const baseSchemas = {
    problem: Joi.object({
        number: Joi.number().integer().min(1).required(),
        date: Joi.date().iso().required(),
        name: Joi.string().min(3).required(),
        solved: Joi.boolean().required(),
        url: Joi.string().uri({ scheme: ['http', 'https'] }).required()
    })
};

const fullSchemas = {};
const partialSchemas = {};

for (const [name, schema] of Object.entries(baseSchemas)) {
    fullSchemas[name] = schema;
    partialSchemas[name] = schema.fork(
        Object.keys(schema.describe().keys),
        (field) => field.optional()
    );
}

function validateRecord(schemaName, data) {
    const schema = fullSchemas[schemaName];
    if (!schema) {
        throw new Error(`No schema defined for: ${schemaName}`);
    }

    if (!data) {
        throw new Error(`No data passed in for new record`);
    }

    const { error, value } = schema.validate(data, { stripUnknown: true });

    if (error) {
        throw new Error(`Add validation failed: ${error.message}`);
    }

    return value;
}

function validateUpdate(schemaName, data) {
    const schema = partialSchemas[schemaName];
    if (!schema) {
        throw new Error(`No schema defined for: ${schemaName}`);
    }

    if (!data) {
        throw new Error(`No data passed in for new record`);
    }

    const { error, value } = schema.validate(data, { stripUnknown: true });

    if (error) {
        throw new Error(`Update validation failed: ${error.message}`);
    }

    return value;
}

module.exports = { validateRecord, validateUpdate };