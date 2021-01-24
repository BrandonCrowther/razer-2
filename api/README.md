# Razer's App

Initial repo for the project. Currently only has GET requests set up


## Install:
* Install mysqldb
* Install Node.js latest version (v12.13.1)
* Install npm
* Run `npm install`
* Run `npm install -g nodemon`
* Run `node dummy.js` to generate some data
* Run `nodemon start`


## Using the app

You can check index.js to see what kind of routes are currently implemented. API routes are prepended with /api and return json responses.

Anything aside from /login and /api/login are behind authentication, and require a post to the aforementioned routes to set your session cookie first.