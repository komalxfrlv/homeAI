const Ajv = require("ajv");
const ajv = new Ajv();

/*
    VERSION VALIDATION
*/

async function validateVersionCreating(data) {
    const schema = {
        type: "object",
        properties: {
            fileUrl: { type: "string"},
            description: { type: "string"},
            version: { type: "string"},
            deviceId: { type: "string"},
        },
        required: [
            "fileUrl", "description", "version", "deviceId"
        ],
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
    validateVersionCreating,
}