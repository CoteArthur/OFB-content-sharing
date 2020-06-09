import { Request, Response } from 'express';
import * as mysql from 'mysql';
import config from '../config/config';
import * as fs from 'fs';
import * as shortid from 'shortid';
import * as path from 'path';

const connection = mysql.createConnection(config.mysql);

export default class HomeController 
{
        /**
         * Index get request: serve the react app.
         * @param req - Unused param.
         * @param res - Server the react app.
         * @param next - Unused param.
         */
        public index(req: Request, res: Response, next: Function): void
        {
                res.sendFile(path.join(__dirname, 'build', 'index.html'));
        }

	public actualite(req: Request, res: Response): void
	{
                let strQuery = `SELECT * FROM actualite`;

                if(req.body.search){
                        strQuery += ` WHERE titre LIKE '%${req.body.search}%'`;
                        if(req.body.sites){
                                strQuery += ` AND site IN (${req.body.sites})`;
                        }
                }else{
                        if(req.body.sites){
                                strQuery += ` WHERE site IN (${req.body.sites})`;
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
                let strQuery = `SELECT * FROM crterrain`;

                if(req.body.search){
                        strQuery += ` WHERE titre LIKE '%${req.body.search}%'`;
                        if(req.body.sites){
                                strQuery += ` AND site IN (${req.body.sites})`;
                        }
                }else{
                        if(req.body.sites){
                                strQuery += ` WHERE site IN (${req.body.sites})`;
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

                console.log(strQuery);
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

        public getFile(req: Request, res: Response): void
	{
                fs.readFile(`./files/${req.body.file}`, {encoding: 'base64'}, (err, data) => {
                        // if(err) {
                        //         res.json(err);
                        // }
                        if(data){
                                let fileType = req.body.file.split('.')[1];
                                if(fileType !== 'pdf'){
                                        res.json({data: `data:image/${req.body.file.split('.')[1]};base64,`+data});
                                }else{
                                        res.json({data: `data:application/${req.body.file.split('.')[1]};base64,`+data});
                                }
                        }       
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