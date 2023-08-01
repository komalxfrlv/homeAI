const { db } = require('../../../utils/db');

async function getAll() {
    return await db.city.findMany();
}

async function getById(cityId) {
    return await db.city.findUnique({
        where: {
            id: cityId
        }
    })
}

module.exports = {
    getAll,
    getById,
}