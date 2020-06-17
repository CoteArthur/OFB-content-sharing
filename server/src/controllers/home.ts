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

	public actualite(req: Request, res: Response): void
	{
                let strQuery = `SELECT actualite.* FROM actualite`;
                
                if(req.body.auteur){
                        let arrayAuteur = req.body.auteur.split(' ');
                        strQuery += ` LEFT JOIN users ON actualite.userID = users.id WHERE users.email LIKE '%${arrayAuteur[0]}%'`;
                        if(arrayAuteur[1]){
                                strQuery += ` AND users.email LIKE '%${arrayAuteur[1]}%'`;
                        }
                        if(req.body.search){
                                strQuery += ` AND titre LIKE '%${req.body.search}%'`;
                        }
                        if(req.body.sites){
                                strQuery += ` AND site IN (${req.body.sites})`;
                        }
                        if(req.body.year){
                                strQuery += ` AND YEAR(date) = ${req.body.year}`
                        }
                }else{
                        if(req.body.search){
                                strQuery += ` WHERE titre LIKE '%${req.body.search}%'`;
                                if(req.body.sites){
                                        strQuery += ` AND site IN (${req.body.sites})`;
                                }
                                if(req.body.year){
                                        strQuery += ` AND YEAR(date) = ${req.body.year}`
                                }
                        }else{
                                if(req.body.sites){
                                        strQuery += ` WHERE site IN (${req.body.sites})`;
                                        if(req.body.year){
                                                strQuery += ` AND YEAR(date) = ${req.body.year}`
                                        }
                                }else{
                                        if(req.body.year){
                                                strQuery += ` WHERE YEAR(date) = ${req.body.year}`
                                        }
                                }
                        }
                }

                if(req.body.orderBy){
                        if(req.body.desc){
                                strQuery += ` ORDER BY ${req.body.orderBy} DESC`;
                        }else{
                                strQuery += ` ORDER BY ${req.body.orderBy} ASC`;
                        }
                }else{
                        strQuery += ` ORDER BY date DESC`;
                }

                connection.query(strQuery, (err, results) => {
                        if(err) {
                        res.json(err);
                        }
                        res.json(results);
                });
        }
        
	public insertActualite(req: Request, res: Response): void
	{       
                let fileName = shortid.generate();
                let fileType = req.body.file.split('/')[1].split(';')[0];

                fs.writeFile(`./files/${fileName}.${fileType}`, req.body.file.split(';base64,').pop(), {encoding: 'base64'}, (err) => {
                        if(err){
                                console.log(err);
                        }
                });

                connection.query(`INSERT INTO actualite (id, titre, site, description, date, userID, file) VALUES (NULL, '${req.body.titre}', '${req.body.site}','${req.body.description}', current_timestamp(), '${req.body.userID}', '${fileName}.${fileType}')`,
                (err, results) => {
                        if(err) {
                        res.json(err);
                        }
                        res.json(results);
                });
        }
        
	public crterrain(req: Request, res: Response): void
	{
                let strQuery = `SELECT crterrain.* FROM crterrain`;

                if(req.body.auteur){
                        let arrayAuteur = req.body.auteur.split(' ');
                        strQuery += ` LEFT JOIN users ON crterrain.userID = users.id WHERE users.email LIKE '%${arrayAuteur[0]}%'`;
                        if(arrayAuteur[1]){
                                strQuery += ` AND users.email LIKE '%${arrayAuteur[1]}%'`;
                        }
                        if(req.body.search){
                                strQuery += ` AND titre LIKE '%${req.body.search}%'`;
                        }
                        if(req.body.sites){
                                strQuery += ` AND site IN (${req.body.sites})`;
                        }
                        if(req.body.year){
                                strQuery += ` AND YEAR(date) = ${req.body.year}`
                        }
                }else{
                        if(req.body.search){
                                strQuery += ` WHERE titre LIKE '%${req.body.search}%'`;
                                if(req.body.sites){
                                        strQuery += ` AND site IN (${req.body.sites})`;
                                }
                                if(req.body.year){
                                        strQuery += ` AND YEAR(date) = ${req.body.year}`
                                }
                        }else{
                                if(req.body.sites){
                                        strQuery += ` WHERE site IN (${req.body.sites})`;
                                        if(req.body.year){
                                                strQuery += ` AND YEAR(date) = ${req.body.year}`
                                        }
                                }else{
                                        if(req.body.year){
                                                strQuery += ` WHERE YEAR(date) = ${req.body.year}`
                                        }
                                }
                        }
                }
                
                if(req.body.orderBy){
                        if(req.body.desc){
                                strQuery += ` ORDER BY ${req.body.orderBy} DESC`;
                        }else{
                                strQuery += ` ORDER BY ${req.body.orderBy} ASC`;
                        }
                }else{
                        strQuery += ` ORDER BY date DESC`;
                }

                connection.query(strQuery, (err, results) => {
                        if(err) {
                        res.json(err);
                        }
                        res.json(results);
                });
        }
        
        public insertCrterrain(req: Request, res: Response): void
	{      
                let fileName = shortid.generate();
                //TODO check if file name already exists
                fs.writeFile(`./files/${fileName}.pdf`, req.body.file.split(';base64,').pop(), {encoding: 'base64'}, (err) => {
                        if(err){
                                console.log(err);
                        }
                });

                connection.query(`INSERT INTO crterrain (id, titre, site, theme, keywords, file, date, userID) VALUES (NULL, '${req.body.titre}', '${req.body.site}', '${req.body.theme}', '${req.body.keywords}', '${fileName}.pdf', current_timestamp(), '${req.body.userID}')`,
                (err, results) => {
                        if(err) {
                                res.json(err);
                        }
                        res.json(results);
                });
        }

        public login(req: Request, res: Response): void
	{
                connection.query(`SELECT id FROM users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`,
                (err, results) => {
                        if(err) {
                        res.json(err);
                        }
                        res.json(results);
                });
        }

        public selectUserInfo(req: Request, res: Response): void
	{
                connection.query(`SELECT email FROM users WHERE id = '${req.body.id}'`,
                (err, results) => {
                        if(err) {
                        res.json(err);
                        }
                        res.json(results);
                });
        }
}

export const homeController = new HomeController();