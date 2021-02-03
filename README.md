# IBM Feedback
Integrated with the IBM Cloud

![Type](https://img.shields.io/badge/Type-JavaScript-blue.svg)
![npm](https://img.shields.io/npm/v/ibm-verify-sdk.svg?style=plastic)
![NPM](https://img.shields.io/npm/l/ibm-verify-sdk.svg?colorB=blue&style=plastic)

* [Installation](#getting-started)
* [Configuration Settings](#configuration-settings)
* [License](#license)

Feedback widgets provide a place for customers to attach screenshots and more information, making it more likely that your agents can give customers a quality answer on their first response. You are helping your customers frame their questions in a helpful manner. 

Feedback widget also connect with the github and slack, so whenever client submit feedback automatic issue created on conencted github and posted on connected slack channel. 

Feedback Widget based on the IBM IAM, So you need to have IBM account and create the [IBM API keys](https://cloud.ibm.com/docs/account?topic=account-userapikey) This API key will be used to login in the system as super admin. 

You have to add the [IBM API keys](https://cloud.ibm.com/docs/account?topic=account-userapikey) and IBM account details in the user table get access the IBM feedback widht admin panel. 

IBM Feedback currently supports the following types of ratings:
 - **Star**
    - 1 to 5 stars rating.
 - **Smily**
	- 3 point smiley rating.
 - **Number**
	-	1 to 5 Number rating.


## Prerequisites
**Important following items are required to login in the IBM Feedback.**
 - Configuring your [IBM API keys](https://cloud.ibm.com/docs/account?topic=account-userapikey)
 - Create & Configure Cloud Storage [IBM Cloud Storage](https://cloud.ibm.com/docs/cloud-object-storage).
 - Create & Configure the Slack [Webhooks] (https://api.slack.com/messaging/webhooks) *Optional*
 - Create & Configure the GitHub [Personal Access Token] (https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) *Optional*

# Installation
After configuring your “IBM Identity Access”, you can clone and install the IBM Feedback:

## Running Locally
Please make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone git@github.com:whizpool/ibm-feedback.git # or clone your own fork
```
## Default SQL
Import default database (default-sql) in your db.


## Backend-api
```sh
cd inappfeedback/server
npm install
npm run start-dev
```
## Frontend Admin Panel
```sh
cd inappfeedback/client
npm install
npm start
```

## Configuration Settings
For the backend API, please review the config/config.global.js and for the frontend, please review the .env and update the required parameters accordingly.


# License
The MIT License (MIT)

Copyright (c) 2019, 2020 IBM

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
