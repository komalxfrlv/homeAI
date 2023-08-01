const metricsServices = require('./metrics.services');
const currentUser = require('../../../utils/getUser');

async function createNewMetric(req, res, next) {

    const user = await currentUser(req);
    req.body.userId = user.id;

    try {
        const metric = await metricsServices.createMetric(req.body);
        res.status(201).json(metric);
    } catch (error) {
        next(error);
    }

}

module.exports = {
    createNewMetric
};