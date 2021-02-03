# IBM-feedback API

Node.js / Express Web Application with IBM Clound IAM.

Setup
----------
Install dependencies by using: **npm install**  
Install nodemon: **npm install -g nodemon**  
Install mocha: **npm install --g mocha**

Ignore - "test": "npm run test-unit && npm run test-integration"

Configuration
----------
Directory **config** contains global and sample configuration file. You should create
**config.development.js** and **config.prod.js** files respectively using values for your environments.
By default the application is using Postgres as the database

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

# License
The MIT License (MIT)

Copyright (c) 2019, 2020 IBM

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.