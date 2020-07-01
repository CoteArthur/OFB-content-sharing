# OFB

[![CodeFactor](https://www.codefactor.io/repository/github/cotearthur/ofb/badge/master?s=a050a33060a41263274fe175fabb0d3af3b97fe7)](https://www.codefactor.io/repository/github/cotearthur/ofb/overview/master)

## Setup
_Pre-Requisites:_
1. [NodeJS (version 12+)](https://nodejs.org/en/)
2. [Node Package Manager (npm)](https://www.npmjs.com/)
3. [Maria DB Server](https://mariadb.org/)

_Setup Commands:_

    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
    sudo apt-get install -y nodejs

    git clone https://github.com/CoteArthur/OFB.git
    cd ofb

    sudo apt install mariadb-server
    sudo mysql
      CREATE DATABASE ofb;
    sudo mysql -p ofb < ofb-db-template.sql
    sudo mysql
      CREATE USER 'server' IDENTIFIED BY 'server';
      GRANT ALL PRIVILEGES ON ofb TO 'server';

    npm i
    npm run build

    cd ./server
    npm i
    npm run build
    npm start
