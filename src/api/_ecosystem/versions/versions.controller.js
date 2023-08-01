var crypto = require('crypto');
const {
    validateVersionCreating
} = require('./versions.validators');
const { findUserById } = require('../../users/users.services');

const {
    createVersion,
    getAll,
    findVersionById,
} = require('./versions.services')


async function createNewVersion(req, res, next) {
    try {
        let version = req.body;
        let file = req.files.fileUrl;
        version.fileUrl = file.name
        await validateVersionCreating(version)
        if(!file) return res.json("Can't find file")
        const filePath = "../m2m_noda/storage/versions"
        const servFileName = `${crypto.createHash('md5').update(`${file.name}${Date.now()}`).digest('hex')}.bin`;
        version.servFileUrl = servFileName
        await file.mv(`${filePath}/${servFileName}`)  
        let created_version = await createVersion(version);

        res.json(created_version);

    }
    catch (err) {
        next(err);
    }
}

async function downloadNewVersion(req, res, next) {
    try {
        let version = await findVersionById(req.query.id);
        const filePath = "../m2m_noda/storage/versions"
        res.download(`${filePath}/${version.servFileUrl}`, version.servFileUrl); 
    } catch (err) {
        next(err);
    }
}



async function getAllVersion(req, res, next) {
    try {
        res.json(await getAll());
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createNewVersion,
    getAllVersion,
    downloadNewVersion,
    //uploadNewVersion
}