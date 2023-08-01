const Ajv = require("ajv");
const ajv = new Ajv();

/*
    USER VALIDATION
*/

async function validateUserCreating(data) {
    const schema = {
        type: "object",
        properties: {
            name: { type: "string" },
            surname: { type: "string" },
            patronymic: { type: "string"},
            email: { type: "string" },
            password: { type: "string"},
            phone: { type: "integer" },
            cityId: { type: "string" },
            client: { type: "string"},
        },
        required: [
            "name", "surname", "patronymic", 
            "email", "password", "phone", "cityId",
            "client"
        ],
        additionalProperties: false
    };

    const validate = ajv.compile(schema);

    const valid = validate(data);

    return valid;
}

async function validateUserSettingsChanging(data) {
    data.phone = Number(data.phone)
    const schema = {
        type: "object",
        properties: {
            name: { type: "string", nullable: true },
            surname: { type: "string", nullable: true },
            patronymic: { type: "string", nullable: true },
            email: { type: "string", nullable: true },
            password: { type: "string", nullable: true },
            phone: { type: "integer", nullable: true },
            cityId: { type: "string", nullable: true },
            client: { type: "string", nullable: true },
            auto_updating: { type: "boolean", nullable: true },
            auto_paying: { type: "boolean", nullable: true },
        },
        required: [
            "name", "surname", "patronymic", 
            "email", "password", "phone", "cityId",
            "client", "auto_updating", "auto_paying"
        ],
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    const valid = validate(data);
    if (!valid) {
        const valErr = validate.errors;
        throw new Error(`${valErr[0]["instancePath"]} ${valErr[0]["message"]}`);
    return valid;
    }
}

module.exports ={
    validateUserCreating,
    validateUserSettingsChanging,
}