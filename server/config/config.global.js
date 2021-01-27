var config = module.exports = {};

config.env = 'undefined';
config.hostname = 'undefined.example.com';
config.sessionSecret = 'undefined-session-secret';
config.debug = false;
/*FRONT END PUBLIC ASSET*/
config.ratingImageUrl = 'http://localhost:3000/assets/';

/*API END HOST*/
config.apihost = 'http://localhost:8080/api/v1/';

/*IBM Service credentials Please here*/
/*Copy the IBM Cloud storage bucket name and write in the BucketName param*/
config.IBMCONFIG = {
  useHmac: true,
	bucketName: 'cloud-object-xxxxxxxxxxxxx',
	serviceCredential: [Service credentials-with-hmac goes here],
};
/*S3 API*/
config.defaultEndpoint = 's3.us.cloud-object-storage.appdomain.cloud';

