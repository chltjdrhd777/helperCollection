#!/bin/bash

# move to project root
cd "$(dirname "$0")" || exit
cd ..

# variables
NGINX_DIR="$PWD/nginx"
NGINX_CONF="${NGINX_DIR}/nginx.conf"

BLUE_PORT=20160
BLUE_PROCESS_NAME="blue"

GREEN_PORT=20161
GREEN_PROCESS_NAME="green"

# function
edit_conf_port() {
    TARGET_PORT=$1

    sed -i "s/proxy_pass http:\/\/localhost:[0-9]\+;/proxy_pass http:\/\/localhost:${TARGET_PORT};/" $NGINX_CONF
}

blue_green_deploy() {
    DEPLOY_TARGET=$1
    IS_FIRST_DEPLOY=$2

    DEPLOY_PORT=""
    CURRENT_PROCESS=""
    
    if [ $DEPLOY_TARGET = "green" ]; then
        DEPLOY_PORT=$GREEN_PORT
        CURRENT_PROCESS=$BLUE_PROCESS_NAME
    else
        DEPLOY_PORT=$BLUE_PORT
        CURRENT_PROCESS=$GREEN_PROCESS_NAME
    fi

    pm2 start --name $DEPLOY_TARGET npm -- run "start:${DEPLOY_TARGET}" --disable-logs
    edit_conf_port $DEPLOY_PORT

    if [ -n "$IS_FIRST_DEPLOY" ]; then
        # nginx -c $NGINX_CONF
        echo "ok"
    else
        # nginx -c $NGINX_CONF -s reload
        pm2 delete $CURRENT_PROCESS
    fi
}

### deploy start 
# step 1. get deploy target
BLUE_PID=$(pm2 list | grep -c "blue")
GREEN_PID=$(pm2 list | grep -c "green")
DEPLOY_TARGET=""

if [ $BLUE_PID = 1 ]; then
    DEPLOY_TARGET="green"
elif [ $GREEN_PID = 1 ]; then  
    DEPLOY_TARGET="blue"
else
    echo "no process was detected. start blue"
    blue_green_deploy "blue" "first_deploy"

    echo "Deploy finished"
    exit 0
fi

# step 2. run blue_green_deploy
blue_green_deploy "$DEPLOY_TARGET"
echo "Deploy finished"
