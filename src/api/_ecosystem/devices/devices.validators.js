const Ajv = require("ajv");
const { json } = require("express");
const ajv = new Ajv();

async function validateDevice(data) {
    const schema = {
        type: "object",
        properties: {
            name: { type: "string" },
        },
        required: ["name"],
        additionalProperties: false
    };

    const validate = ajv.compile(schema);

    const valid = validate(data);
    if (!valid) {
        const valErr = validate.errors;
        throw new Error(`${valErr[0]["instancePath"]} ${valErr[0]["message"]}`);
    }
    return valid
}

module.exports = {
    validateDevice,
};