import { Request, Response } from 'express';
import * as mysql from 'mysql';
import config from '../config/config';
import * as fs from 'fs';
import * as shortid from 'shortid';
import * as path from 'path';

const connection = mysql.createConnection(config.mysql);

export default class HomeController 
{
        public index(req: Request, res: Response, next: Function): void
        {
                res.sendFile(path.join(__dirname, 'build', 'index.html'));
        }

        public login(req: Request, res: Response): void
	{
                connection.query(`SELECT id FROM users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`,
                (err, results) => {
                        if(err) 
                                res.json(err);
                        res.json(results);
                });
        }

        public selectUserInfo(req: Request, res: Response): void
	{
                connection.query(`SELECT email FROM users WHERE id = '${req.body.id}'`,
                (err, results) => {
                        if(err) 
                                res.json(err);
                        res.json(results);
                });
        }

        public select(req: Request, res: Response): void
	{
                let strQuery = `SELECT ${req.body.table}.*, users.email FROM ${req.body.table} LEFT JOIN users ON ${req.body.table}.userID = users.id`;

                if(req.body.filters){
                        if(req.body.filters.auteur){
                                let arrayAuteur = req.body.filters.auteur.split(' ');
                                strQuery += ` WHERE users.email LIKE '%${arrayAuteur[0]}%'`;
                                if(arrayAuteur[1])
                                        strQuery += ` AND users.email LIKE '%${arrayAuteur[1]}%'`;
        
                                if(req.body.filters.search)
                                        strQuery += ` AND titre LIKE '%${req.body.filters.search}%'`;
        
                                if(req.body.filters.sites)
                                        strQuery += ` AND site IN (${req.body.filters.sites})`;
        
                                if(req.body.table === 'connaissancesproduites' || req.body.table === 'operationsgestion'){
                                        if(req.body.filters.themes)
                                                strQuery += ` AND theme IN (${req.body.filters.themes})`;
                                }
        
                                if(req.body.filters.year)
                                        strQuery += ` AND YEAR(date) = ${req.body.filters.year}`
                        }else{
                                if(req.body.filters.search){
                                        strQuery += ` WHERE titre LIKE '%${req.body.filters.search}%'`;
        
                                        if(req.body.filters.sites)
                                                strQuery += ` AND theme IN (${req.body.filters.sites})`;
        
                                        if(req.body.table === 'connaissancesproduites' || req.body.table === 'operationsgestion'){
                                                if(req.body.filters.themes)
                                                        strQuery += ` AND theme IN (${req.body.filters.themes})`;
                                        }
        
                                        if(req.body.filters.year)
                                                strQuery += ` AND YEAR(date) = ${req.body.filters.year}`;
                                }else{
                                        if(req.body.filters.sites){
                                                strQuery += ` WHERE site IN (${req.body.filters.sites})`;
        
                                                if(req.body.table === 'connaissancesproduites' || req.body.table === 'operationsgestion'){
                                                        if(req.body.filters.themes)
                                                                strQuery += ` AND theme IN (${req.body.filters.themes})`;
                                                }
        
                                                if(req.body.filters.year)
                                                        strQuery += ` AND YEAR(date) = ${req.body.filters.year}`;
                                        }else{
                                                if(req.body.table === 'connaissancesproduites' || req.body.table === 'operationsgestion'){
                                                        if(req.body.filters.themes){
                                                                strQuery += ` WHERE theme IN (${req.body.filters.themes})`;
                                                }
        
                                                        if(req.body.filters.year)
                                                                strQuery += ` AND YEAR(date) = ${req.body.filters.year}`;
                                                }else{
                                                        if(req.body.filters.year)
                                                                strQuery += ` WHERE YEAR(date) = ${req.body.filters.year}`;
                                                }
                                        }
                                }
                        }
                        
                        if(req.body.filters.orderBy){
                                if(req.body.filters.desc){
                                        strQuery += ` ORDER BY ${req.body.filters.orderBy} DESC`;
                                }else{
                                        strQuery += ` ORDER BY ${req.body.filters.orderBy} ASC`;
                                }
                        }else{
                                strQuery += ` ORDER BY date DESC`;
                        }
                }else{
                        strQuery += ` ORDER BY date DESC`;
                }

                connection.query(strQuery, (err, results) => {
                        if(err)
                                res.json(err);
                        res.json(results);
                });
        }
        
        public insert(req: Request, res: Response): void
	{      
                let fileName = shortid.generate();
                let fileType = req.body.file.split('/')[1].split(';')[0];

                fs.writeFile(`./files/${fileName}.${fileType}`, req.body.file.split(';base64,').pop(), {encoding: 'base64'}, (err) => {
                        if(err)
                                console.log(err);
                });

                let strQuery: string;
                switch(req.body.type) { 
                        case 'actualite': { 
                                strQuery = `INSERT INTO actualite (id, titre, site, description, date, userID, file) VALUES (NULL, '${req.body.titre}', '${req.body.site}','${req.body.description}', current_timestamp(), '${req.body.userID}', '${fileName}.${fileType}')`;
                                break; 
                        } 
                        case 'crterrain':
                        case 'crpolice': { 
                                strQuery = `INSERT INTO ${req.body.type} (id, titre, site, keywords, file, date, userID) VALUES (NULL, '${req.body.titre}', '${req.body.site}', '${req.body.keywords}', '${fileName}.pdf', current_timestamp(), '${req.body.userID}')`;
                                break; 
                        } 
                        case 'connaissancesproduites':
                        case 'operationsgestion': { 
                                strQuery = `INSERT INTO ${req.body.type} (id, titre, site, theme, keywords, file, date, userID) VALUES (NULL, '${req.body.titre}', '${req.body.site}', '${req.body.theme}', '${req.body.keywords}', '${fileName}.pdf', current_timestamp(), '${req.body.userID}')`;
                                break; 
                        } 
                        default: { 
                                console.log('error');
                                break; 
                        } 
                } 
                connection.query(strQuery,
                (err, results) => {
                        if(err) 
                                res.json(err);
                        res.json(results);
                });
        }              
}

export const homeController = new HomeController();