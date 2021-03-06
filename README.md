francois-developer
==================

A small HTML5 web app to showcase my skills to recruiters. <a href="http://francois-dev.no-ip.biz" target="_blank">Check it out live</a>.

# Install
    
    npm install git+https://github.com/co2-git/francois-developer.git
    cd ~/node_modules/francois-dev
    npm run build
    npm test

# Uninstall

    cd ~/node_modules
    npm uninstall francois-dev

# Build

Builds the code for production.

    npm run build    

# Start http-server

    npm start

# Start for production

This will start server for production. Don't forget to run `npm run build` to make sure all your prod files are up-to-date.

    npm run build
    npm --app-env=production start

# Stop http-server

    npm stop

# Get http-server status

    npm run status

# Live update

If you go through usual `npm update` to update and you have your server live, your server will go down during the update. If you want to update while keeping your live server up, do as below (*Note:* this will use git).

To update your `node` dependencies or your `bower` dependencies, do as usual:

    npm update
    bower update

    npm run live-update

# Version

Return current version.

    npm version | grep francois-dev

# Help

    npm run help