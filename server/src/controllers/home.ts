import { Request, Response } from 'express';
import * as mysql from 'mysql';
import config from '../config/config';
import * as fs from 'fs';
import * as shortid from 'shortid';

const connection = mysql.createConnection(config.mysql);

export default class HomeController 
{
	public actualite(req: Request, res: Response): void
	{
                connection.query(`SELECT * FROM actualite`, (err, results) => {
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

                connection.query(`INSERT INTO actualite (id, titre, description, date, userID, file) VALUES (NULL, '${req.body.titre}', '${req.body.description}', current_timestamp(), '${req.body.userID}', '${fileName}.${fileType}')`,
                (err, results) => {
                        if(err) {
                        res.json(err);
                        }
                        res.json(results);
                });
        }
        
	public crterrain(req: Request, res: Response): void
	{
                connection.query(`SELECT * FROM crterrain`, (err, results) => {
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