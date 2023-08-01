const { getAll } = require('./cities.service');

async function getAllCities(req, res, next) {
    res.json(await getAll());
}

module.exports = {
    getAllCities
}