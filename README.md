francois-developer
==================

A small HTML5 web app to showcase my skills to recruiters. <a href="http://192.237.218.147:3100" target="_blank">Check it out live</a>.

# Install
    
    npm install git+https://github.com/co2-git/francois-developer.git
    cd ~/node_modules/francois-dev
    npm run build

# Uninstall

    cd ~/node_modules
    npm uninstall francois-dev

# Build

Builds the code for production (compiling LESS files). *Note*: this is done by default before starting the server for production.

    npm run build    

# Start http-server

    npm start

# Start for production

    npm --env=production start

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

    npm run version

# Help

    npm run help