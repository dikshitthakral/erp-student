const storage = require('./storage');
const util = require("util");
const fs = require("fs");

const uploadImage = async (file) => {
    const unlinkFile = util.promisify(fs.unlink);
    const location = await storage.uploadFile(file);
    // Deleting from local if uploaded in S3 bucket
    await unlinkFile(file.path);
    return location;
}

module.exports = { uploadImage }