# IBM Feedback
Integrated with the IBM Cloud

![Type](https://img.shields.io/badge/Type-JavaScript-blue.svg)
![npm](https://img.shields.io/npm/v/ibm-verify-sdk.svg?style=plastic)
![NPM](https://img.shields.io/npm/l/ibm-verify-sdk.svg?colorB=blue&style=plastic)

* [Configuration Settings](#configuration-settings)
* [Installation](#installation)
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

## IBM Services 
We have used the following IBM cloud services in this projects

- [IBM Cloud Storage](https://cloud.ibm.com/docs/cloud-object-storage)
We have used the Cloud Storage for storing the image / screenshots. IBM Cloud Object Storage is an application-data archive and backup platform that offers persistent cloud storage and data encryption by default. Made for electronic records retention, it helps with regulatory compliance.

- [IBM Cloud User Management & Access Managment](https://cloud.ibm.com/apidocs/user-management)
You can access and use IBM Cloud IAM through the Access (IAM) UI, CLI, or API. To access IBM Cloud IAM by using the console, go to Manage > Access (IAM). Go to Managing IAM access, API keys, service IDs, and access groups to review the available CLI commands.

- [IBM Carbon design](https://carbondesignsystem.com/)
Carbon is the design system for IBM web and product. It is a series of individual styles, components, and guidelines used for creating unified UI.


## Configuration Settings

Backend-api
----------
Directory **config** contains global and sample configuration file. You should create
**config.development.js** and **config.prod.js** files respectively using values for your environments.

Frontend-Admin Panel
----------
Create environments with base url as defined in the **sample.env**

# Installation
After creating and configuring your “IBM Identity Access”, you can clone and install the IBM Feedback:

## Running Locally
Please make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone git@github.com:whizpool/ibm-feedback.git # or clone your own fork
```
## Default SQL
Import default database (default-sql) in your db.


## Backend-api
Node.js / Express Web Application with IBM Clound IAM.

```sh
cd inappfeedback/server
npm install
```

Setup
----------
Install dependencies by using: **npm install**  
Install nodemon: **npm install -g nodemon**  
Install mocha: **npm install --g mocha**

Ignore - "test": "npm run test-unit && npm run test-integration"

Running
----------
+ Run app in dev: **npm run start-dev**
+ + Run app in prod: **npm run start**
+ Run app with debug by using: **DEBUG=sampleapp:\* npm start**
+ Run app with debug and nodemon using: **DEBUG=sampleapp:\* nodemon ./bin/www**
+ Nodemon should also work this way: **nodemon**

Testing
----------
+ in the command line enter: **mocha**

Browser
----------
+ in the browser open the url: **http://localhost:8080/** or whatever your localhost is if cloud IDE

## Frontend Admin Panel
```sh
cd inappfeedback/client
npm install
```
In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# License
The MIT License (MIT)

Copyright (c) 2019, 2020 IBM

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
