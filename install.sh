#!/bin/bash

# Check if running as root
if [ "$(id -u)" != "0" ]; then
    echo "This script must be run as root" 1>&2
    exit 1
fi

NOCOLOR='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
LIGHTGRAY='\033[0;37m'
DARKGRAY='\033[1;30m'
LIGHTGREEN='\033[1;32m'
YELLOW='\033[1;33m'
LIGHTRED='\033[1;34m'
LIGHTPURPLE='\033[1;35m'
LIGHTCYAN='\033[1;36m'
WHITE='\033[1;37m'

echo -e "${YELLOW}Starting..."
clear

echo -e "${GREEN}Installing NodeJs..."
apt install -y nodejs

echo -e "${GREEN}Installing Npm..."
apt install -y npm

echo -e "${GREEN}Installing Python..."
apt install -y python

echo -e "${GREEN}Installing Node Modules..."
npm install 

echo -e "${GREEN}Installing Nodemon..."
npm install nodemon -g

echo -e "${RED}If You're Not Added valid values in config.json Please add"

echo -e "${GREEN}Starting..."
npm start
