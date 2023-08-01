const {createGroup,
        getAllGroups,
        addUserToGroup} = require("./userGroups.services")
const {findUserById} = require("../../users/users.services")
async function addGroup(req, res, next){
    try{
        const { userId } = req.payload;
        if(!req.body.name) {
            res.json("Can't find name")
            throw new Error("Can't find name")
        }
        const newGroupId = await createGroup(req.body.name, userId)
        res.json(newGroupId)      
    }
    catch(err){
        next(err)
    }
}

async function getGroups(req, res, next){
    try{
        res.json(await getAllGroups())
    }
    catch(err){
        next(err)
    }
}

async function postUserToGroup(req, res, next){
    try{
        const { userId } = req.payload;
        if(!req.body.groupId){
            res.json("Can't find groupId in request")
            throw new Error("Can't find groupId in request")   
        }
        await addUserToGroup(req.body.groupId, userId)
        res.json("DONE!")
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    addGroup,
    getGroups,
    postUserToGroup
}