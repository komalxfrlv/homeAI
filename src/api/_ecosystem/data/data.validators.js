const Ajv = require("ajv");
const ajv = new Ajv();

async function validateDataCreating(data) {
    const schema = {
        type: "object",
        properties: {
            value: { type: "object" },
        },
        required: ["value"],
        additionalProperties: false
    };

    const validate = ajv.compile(schema);

    const valid = validate(data);

    if (!valid) {
        const valErr = validate.errors;
        throw new Error(`${valErr[0]["instancePath"]} ${valErr[0]["message"]}`);
    }

    return valid;
}

async function validateSensorUpdating(data) {
    const schema = {
        type: "object",
        properties: {
            charge: { type: "number" },
            id: { type: "string" },
            uptime: { type: "number" },
        },
        required: ["charge", "id", "uptime"],
        additionalProperties: false
    };

    const validate = ajv.compile(schema);

    const valid = validate(data);

    if (!valid) {
        const valErr = validate.errors;
        throw new Error(`${valErr[0]["instancePath"]} ${valErr[0]["message"]}`);
    }

    return valid;
}

module.exports = {
    validateDataCreating,
    validateSensorUpdating
}