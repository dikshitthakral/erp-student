const AWS = require('aws-sdk');
const properties = require('../../config/properties');
const fs = require("fs");

const s3 = new AWS.S3({
    accessKeyId: properties.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: properties.AWS_S3_SECRET_ACCESS_KEY,
    region: properties.AWS_S3_REGION,
});

const uploadFile = async (file) => {
    try {
        const fileStream = fs.createReadStream(file.path);
        const params = {
            Bucket:  properties.AWS_S3_BUCKET, // pass your bucket name
            Key: file.filename, // file will be saved as testBucket/contacts.csv
            Body: fileStream,
            ContentType: file.mimetype
            // 'image/jpeg'
        };
        const uploadedImage = await s3.upload(params).promise();
        console.log(`uploadedImage:, ${uploadedImage.Location}`)
        return uploadedImage.Location;
    } catch(err) {
        console.error(err, err.stack);
    };
    // try {
    //     var path = file.path;
    //     fs.readFile(path, (err, data) => {
    //     if (err) throw err;
    //     const params = {
    //         Bucket:  properties.AWS_S3_BUCKET, // pass your bucket name
    //         Key: file.filename, // file will be saved as testBucket/contacts.csv
    //         Body: JSON.stringify(data, null, 2)
    //     };
    //     s3.upload(params, function(s3Err, data) {
    //         if (s3Err) throw s3Err
    //         console.log(`File uploaded successfully at ${data.Location}`);
    //         return data.Location;
    //     });
    // });
//   } catch(err) {
//         console.error(err, err.stack);
//     };
};

module.exports = { uploadFile }