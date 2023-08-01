const { db } = require('../../../utils/db');

async function createData(data) {
    return await db.data.create({
        data: data
    });
}

async function getDataInterval(dateFrom, dateTo, sensorId) {
    return await db.data.findMany({
        where:{
                createdAt:{
                        gte: dateFrom,
                        lte: dateTo
            },
            sensorId: sensorId
    },
    orderBy: [
        {
            createdAt:'desc'
        }
    ]
    });
}

module.exports = {
    createData,
    getDataInterval
}