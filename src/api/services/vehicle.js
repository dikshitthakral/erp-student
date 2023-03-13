const storage = require('./storage');
const util = require("util");
const fs = require("fs");

const uploadDocuments = async (files) => {
    const uploadedLocations = [];
    const unlinkFile = util.promisify(fs.unlink);
    for(let document of documents) {
        const file = files[document] ? files[document][0] : undefined;
        if(isEmpty(file)) { continue; }
        const location = await storage.uploadFile(file);
        // Deleting from local if uploaded in S3 bucket
        await unlinkFile(file.path);
        uploadedLocations.push(location);
    }
    return uploadedLocations;
}

module.exports = { uploadDocuments };