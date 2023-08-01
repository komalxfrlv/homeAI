const {
    getById
} = require('../api/_ecosystem/cities/cities.service')
async function getMainServerTime(cityId){
    const currentDate = new Date()
    const city = await getById(cityId)
    if(! city){
        throw new Error("Can't find city with this id")
    }
    currentDate.setHours(currentDate.getHours()-city.UTC)
    return currentDate.toISOString()
}

module.exports = {
    getMainServerTime
}