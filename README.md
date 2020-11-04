# OFB-content-sharing [![CodeFactor](https://www.codefactor.io/repository/github/cotearthur/ofb-content-sharing/badge?s=c4b62f1996e51f19b3acddfa33865084ff6b238b)](https://www.codefactor.io/repository/github/cotearthur/ofb-content-sharing)

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
      
_`gmail-credentials.ts` is missing at `server/src/config`, here's a template:_

```javascript
export const CREDS_USER: string = "email adress";
export const CREDS_PASSWORD: string = "gmail password";
```
You need to turn on [less secure apps](https://myaccount.google.com/lesssecureapps) in order for smtp to work.

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
