import AWS from 'aws-sdk';

//console.log("process.env.AWS_ACCESS_KEY_ID: ", process.env.AWS_ACCESS_KEY_ID);
//console.log("process.env.AWS_SECRET_ACCESS_KEY: ", process.env.AWS_SECRET_ACCESS_KEY);
//console.log("process.env.S3_ENDPOINT: ", process.env.S3_ENDPOINT);

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT,  
    s3ForcePathStyle: true,  
    signatureVersion: 'v4'
});

export default s3;
