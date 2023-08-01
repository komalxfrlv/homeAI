const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const devices = require("../src/utils/devices").getList();

async function addAllDevices() {
    for (let i = 0; i < devices.length; i++) {
        let res = await prisma.deviceType.create({
            data: {
                name: devices[i]
            }
        });   
        console.log(res);
    }
}

addAllDevices();