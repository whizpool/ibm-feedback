/**
 * IBM OBject Storage .
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: ‎09-Dec-2020
 * Last Updated: 25-Jan-2021
*/

/**
 * Module exports.
 * @public
 */

var exports = module.exports = {};

const IBMCOS = require('ibm-cos-sdk');
const rp = require('request-promise');


var env = process.env.NODE_ENV || 'development',
    config = require('./../config/config.' + env);
		
		
var CONFIG = config.IBMCONFIG;
const defaultEndpoint = config.defaultEndpoint

const getS3 = async (endpoint, serviceCredential) => {
  let s3Options;

  if (serviceCredential.apikey) {
			/*
       * Cloud Object Storage S3 can be access via two types of credentials. IAM/HMAC
       * An IAM APIKey can be used to create an S3 Object as below.
       * The APIKey, S3 endpoint and resource Instance Id are required
			*/
    s3Options = {
      apiKeyId: serviceCredential.apikey,
      serviceInstanceId: serviceCredential.resource_instance_id,
      region: 'ibm',
      endpoint: new IBMCOS.Endpoint(endpoint),
    };
  } else {
    throw new Error('IAM ApiKey required to create S3 Client');
  }
  return new IBMCOS.S3(s3Options);
};

const getS3Hmac = async (endpoint, serviceCredential) => {
  let s3Options;

  if (serviceCredential.cos_hmac_keys && serviceCredential.cos_hmac_keys.access_key_id) {
    /*
      * Cloud Object Storage S3 can be access via two types of credentials. IAM/HMAC
      * An HMAC Credential is the equivalent of the AWS S3 credential type
      * The Access Key Id, Secret Access Key, and S3 Endpoint are needed to use HMAC.
      */
    s3Options = {
      accessKeyId: serviceCredential.cos_hmac_keys.access_key_id,
      secretAccessKey: serviceCredential.cos_hmac_keys.secret_access_key,
      region: 'ibm',
      endpoint: new IBMCOS.Endpoint(endpoint),
    };
  } else {
    throw new Error('HMAC credentials required to create S3 Client using HMAC');
  }
  return new IBMCOS.S3(s3Options);
};

/*
 * The listBucketsExtended S3 call will return a list of buckets along with the LocationConstraint.
 * This will help in identifing the endpoint that needs to be used for a given bucket.
 */
const listBuckets = async (s3, bucketName) => {
  const params = {
    Prefix: bucketName
  };
  console.error('\n Fetching extended bucket list to get Location');
  const data = await s3.listBucketsExtended(params).promise();
  console.info(' Response: \n', JSON.stringify(data, null, 2));

  return data;
};

/*
 * Cloud Object Storage is available in 3 resiliency across many Availability Zones across the world.
 * Each AZ will require a different endpoint to access the data in it.
 * The endpoints url provides a JSON consisting of all Endpoints for the user.
 */
const getEndpoints = async (endpointsUrl) => {
  const options = {
    url: endpointsUrl,
    method: 'GET'
  };
  const response = await rp(options);
  return JSON.parse(response);
};


	
/*
 * Once we have the available endpoints, we need to extract the endpoint we need to use.
 * This method uses the bucket's LocationConstraint to determine which endpoint to use.
 */
const findBucketEndpoint = (bucket, endpoints) => {
  const region = bucket.region || bucket.LocationConstraint.substring(0, bucket.LocationConstraint.lastIndexOf('-'));
  const serviceEndpoints = endpoints['service-endpoints'];
  const regionUrls = serviceEndpoints['cross-region'][region]
  || serviceEndpoints.regional[region]
  || serviceEndpoints['single-site'][region];

  if (!regionUrls.public || Object.keys(regionUrls.public).length === 0) {
    return '';
  }
  return Object.values(regionUrls.public)[0];
};

/* Extract the serviceCredential and bucketName from the config.js file
     * The service credential can be created in the COS UI's Service Credential Pane
 */
const { serviceCredential } = CONFIG;
const { bucketName } = CONFIG;

async function getS3Object()	 {
	
	/* Create the S3 Client using the IBM-COS-SDK - https://www.npmjs.com/package/ibm-cos-sdk
     * We will use a default endpoint to initially find the bucket endpoint
     *
     * COS Operations can be done using an IAM APIKey or HMAC Credentials.
     * We will create the S3 client differently based on what we use.
     */
    let s3;
    if (!CONFIG.useHmac) {
      s3 = await getS3(defaultEndpoint, serviceCredential);
    } else {
      s3 = await getS3Hmac(defaultEndpoint, serviceCredential);
    }

    /* Fetch the Extended bucket Info for the selected bucket.
     * This call will give us the bucket's Location
     */
    const data = await listBuckets(s3, bucketName);
    const bucket = data.Buckets[0];

    /* Fetch all the available endpoints in Cloud Object Storage
     * We need to find the correct endpoint to use based on our bucjket's location
     */
    const endpoints = await getEndpoints(serviceCredential.endpoints);

    /* Find the correct endpoint and set it to the S3 Client
     * We can skip these steps and directly assign the correct endpoint if we know it
     */
    s3.endpoint = findBucketEndpoint(bucket, endpoints);

		return s3;
	
}
/**
 * UploadObject To IBM Cloud Storage
 *
 * @public
*/
exports.UploadObject = async function(ImageData,imageType,ImageName) {   	
		
		let s3;
     s3 = await getS3(defaultEndpoint, serviceCredential);

    /* Fetch the Extended bucket Info for the selected bucket.
     * This call will give us the bucket's Location
     */
    const data = await listBuckets(s3, bucketName);
    const bucket = data.Buckets[0];

    /* Fetch all the available endpoints in Cloud Object Storage
     * We need to find the correct endpoint to use based on our bucjket's location
     */
    const endpoints = await getEndpoints(serviceCredential.endpoints);

    /* Find the correct endpoint and set it to the S3 Client
     * We can skip these steps and directly assign the correct endpoint if we know it
     */
    s3.endpoint = findBucketEndpoint(bucket, endpoints);
		
	const base64Data = new Buffer.from(ImageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const params = {
    Bucket: bucketName,
    Key: ImageName,
		ContentEncoding: 'base64',
    ContentType: imageType,
    Body: base64Data,
    Metadata: {
      fileType: imageType
    }
  };	
	await s3.putObject(params).promise();
  return true;		
}

exports.getObjectSignedUrl = async function(ObjectName) {  
    let s3 = await getS3Object();
		const SignedUrl = await s3.getSignedUrl('getObject', {
				Bucket: bucketName,
				Key: ObjectName.toString(),
				Expires: 300
		})
		return SignedUrl
	
}