const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const cities = require("../src/utils/cities").getList();

async function addAllCities() {
    for (let i = 0; i < cities.length; i++) {
        let res = await prisma.city.create({
            data: {
                name: cities[i]
            }
        });   
        console.log(res);
    }
}

addAllCities();