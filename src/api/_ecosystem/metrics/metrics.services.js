const { db } = require('../../../utils/db');

async function createMetric(metric) {
    return metric = await db.metric.create({
        data: metric
    });
}

module.exports = {
    createMetric
}