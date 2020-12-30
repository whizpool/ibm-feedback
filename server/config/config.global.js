var config = module.exports = {};

config.env = 'undefined';
config.hostname = 'undefined.example.com';
config.sessionSecret = 'YmWPMisg3o3WiSkLShrnxZfImSUq4VCJ';
config.debug = true;
config.ratingImageUrl = 'https://feedback.whizpool.com/assets/';
config.apihost = 'https://feedback.whizpool.com/api/v1/';

config.IBMCONFIG = {
  useHmac: true,
	bucketName: 'cloud-object-storage-2u-cos-standard-8k6',
	serviceCredential: {
			"apikey": "ZioA0sLDyFUhqVRGdxjZUS6dggYKqoWdiGqTYWOzgs22",
			"cos_hmac_keys": {
				"access_key_id": "ff954a770db84fd49118c6d79e39e467",
				"secret_access_key": "dd3dbbc0b4de594338acc7733a35ad0444dea5a96f2e4960"
			},
			"endpoints": "https://control.cloud-object-storage.cloud.ibm.com/v2/endpoints",
			"iam_apikey_description": "Auto-generated for key ff954a77-0db8-4fd4-9118-c6d79e39e467",
			"iam_apikey_name": "Service credentials-with-hmac",
			"iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Writer",
			"iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/7c62a18e282e46738e7c1205a73aaa59::serviceid:ServiceId-a742da38-2b8d-4213-a01c-6be7263eea24",
			"resource_instance_id": "crn:v1:bluemix:public:cloud-object-storage:global:a/7c62a18e282e46738e7c1205a73aaa59:60305ce9-58c3-4383-aa05-c7b9976d836d::"
		},
};
config.defaultEndpoint = 's3.us.cloud-object-storage.appdomain.cloud';

