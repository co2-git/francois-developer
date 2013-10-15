francois-developer
==================

A small HTML5 web app to showcase my skills to recruiters. <a href="http://192.237.218.147:3100" target="_blank">Check it out live</a>.

# Install

## Global

	npm install git+https://github.com/co2-git/francois-developer.git -g

## Local
    npm install git+https://github.com/co2-git/francois-developer.git


# Uninstall

## Global

    npm uninstall francois-dev -g

## Local

    npm uninstall francois-dev

# Build

## Global

    francois-dev build

## Local
    
    npm run-script build    

# Start http-server

## Global

    francois-dev start

## Local

    npm start

# Start for production

## Global

    francois-dev start --env=production

## Local

    npm --env=production start

# Stop http-server

## Global

    francois-dev stop

## Local

    npm stop

# Get http-server status

## Global

    francois-dev status

## Local

    npm run-script status

# Update

If you go through usual `npm update` to update and you have your server live, your server will go down during the update. If you want to update while keeping your live server up, do as below:

## Global

    francois-dev update

## Local

    npm run-script update

# Version

## Global

    francois-dev version

## Local

    npm run-script version

# Help

## Global

    francois-dev help

## Local

    npm run-script help