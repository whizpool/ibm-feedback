var config = module.exports = {};

config.env = 'undefined';
config.hostname = 'undefined.example.com';
config.sessionSecret = 'undefined-session-secret';
config.debug = true;
config.ratingImageUrl = 'http://localhost:3000/assets/';
config.apihost = 'http://localhost:8080/api/v1/';
config.IBMCONFIG = {
  useHmac: true,
	bucketName: 'cloud-object-xxxxxxxxxxxxx',
	serviceCredential: [Service credentials-with-hmac goes here],
};
config.defaultEndpoint = 's3.us.cloud-object-storage.appdomain.cloud';

