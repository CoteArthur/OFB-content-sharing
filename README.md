# OFB

[![CodeFactor](https://www.codefactor.io/repository/github/cotearthur/ofb/badge/master?s=a050a33060a41263274fe175fabb0d3af3b97fe7)](https://www.codefactor.io/repository/github/cotearthur/ofb/overview/master)

## Deploy
_Pre-Requisites:_
1. [NodeJS (version 12+)](https://nodejs.org/en/)
2. [Node Package Manager (npm)](https://www.npmjs.com/)
3. [Maria DB Server](https://mariadb.org/)

_Database setup:_

    sudo mysql
      CREATE DATABASE ofb;
    sudo mysql -p ofb < ofb-db-template.sql
    sudo mysql
      CREATE USER 'server' IDENTIFIED BY 'server';
      GRANT ALL PRIVILEGES ON ofb TO 'server';    

_Local:_

    npm i
    npm start
    
    cd server
    npm i
    npm run dev
    
_Production:_

    npm i
    npm run build

    cd server
    npm i
    npm run build
    npm start
