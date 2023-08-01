const { db } = require('../../../utils/db');
async function createGroup(name, userId) {

    let created_group = await db.UserGroups.create({
        data: {
            name: name
        },
    });
    return created_group.id;
}
async function getAllGroups() {
    return await db.UserGroups.findMany();
}

async function addUserToGroup(groupId, userId){
    let users_at_groups = await db.UserToUserGroups.create({
        data: {
            userGroupId: groupId,
            userId: userId
        },
    }); 
    return users_at_groups.id
}

async function getAllUsersTokenInGroup(groupId) {
    return await db.UserGroups.findMany({
    where:{
        id: groupId,
    },
    select: {pushGroups:true}
    });
  }  

module.exports = {
    createGroup,
    getAllGroups,
    addUserToGroup,
    getAllUsersTokenInGroup
}