import { Request, Response } from 'express';
import * as mysql from 'mysql';
import config from '../config/config';

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
                connection.query(`INSERT INTO actualite (id, titre, description, date, auteur, image) VALUES (NULL, '${req.body.titre}', '${req.body.description}', current_timestamp(), 'auteurtest', '${req.body.image}')`,
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
                connection.query(`INSERT INTO crterrain (id, titre, site, theme, keywords, file, date, auteur) VALUES (NULL, '${req.body.titre}', '${req.body.site}', '${req.body.theme}', '${req.body.keywords}', '${req.body.file}', current_timestamp(), 'auteurTest')`,
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
}

export const homeController = new HomeController();