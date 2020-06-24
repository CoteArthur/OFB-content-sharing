import { Request, Response } from 'express';
import * as mysql from 'mysql';
import config from '../config/config';
import * as fs from 'fs';
import * as shortid from 'shortid';
import * as path from 'path';
import { nouns } from '../nouns';
import { createTransport } from 'nodemailer';

const connection = mysql.createConnection(config.mysql);

const transport = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
                user: 'application.partage.ofb@gmail.com',
                pass: 'testofb38',
        },
});

export default class HomeController {
        public index(req: Request, res: Response, next: Function): void {
                res.sendFile(path.join(__dirname, 'build', 'index.html'));
        }

        public login(req: Request, res: Response): void {
                connection.query(`SELECT id FROM users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`,
                (err, results) => {
                        if (err)
                                res.json(err);
                        res.json(results);
                });
        }

        public selectUserInfo(req: Request, res: Response): void {
                connection.query(`SELECT email FROM users WHERE id = '${req.body.id}'`,
                (err, results) => {
                        if (err)
                                res.json(err);
                        res.json(results);
                });
        }

        public createUser(req: Request, res: Response): void {
                connection.query(`SELECT id FROM users WHERE email = '${req.body.email}'`,
                (err, results) => {
                        if (err) res.json(err);

                        if (!(results[0]?.id)) {
                                let password = nouns[Math.floor(Math.random() * Math.floor(nouns.length))]
                                        + Math.floor(Math.random() * Math.floor(100));

                                connection.query(`INSERT INTO users (id, email, password) VALUES (NULL, '${req.body.email}', '${password}');`,
                                (errInsert, resultsInsert) => {
                                        if (errInsert) res.json(errInsert);
                                        console.log(resultsInsert);

                                        const message = {
                                                from: 'cote.arthur.lgm@gmail.com',
                                                to: `${req.body.email}`,
                                                subject: 'Application de partage OFB',
                                                text: `Mot de passe : ${password}`,
                                        };

                                        transport.sendMail(message, function(errSendMail, info) {
                                                if (errSendMail) {
                                                        console.log(errSendMail)
                                                } else {
                                                        console.log(info);
                                                }
                                        });
                                });
                        } else {
                                res.json(true);
                        }
                });
        }

        public select(req: Request, res: Response): void {
                let strQuery = `SELECT ${req.body.table}.*, users.email FROM ${req.body.table} LEFT JOIN users ON ${req.body.table}.userID = users.id`;

                if (req.body.filters) {
                        let j: number, i: number;
                        let filtersArray = [
                                req.body.filters.auteur,
                                req.body.filters.search,
                                req.body.filters.sites,
                                req.body.filters.themes,
                                req.body.filters.year,
                        ];

                        for (i = 0; i < filtersArray.length; i++) {
                                if (filtersArray[i]) {
                                        for (j = i - 1; j >= 0; j--) {
                                                if (filtersArray[j]) {
                                                        j = 1;
                                                }
                                        }

                                        if (j === -2) {
                                                strQuery += ` AND`;
                                        } else {
                                                strQuery += ` WHERE`;
                                        }

                                        switch (i) {
                                                case 0:
                                                        let arrayAuteur = req.body.filters.auteur.split(' ');
                                                        strQuery += ` users.email LIKE '%${arrayAuteur[0]}%'`;
                                                        if (arrayAuteur[1])
                                                                strQuery += ` AND users.email LIKE '%${arrayAuteur[1]}%'`;
                                                        break;
                                                case 1:
                                                        strQuery += ` titre LIKE '%${req.body.filters.search}%'`;
                                                        break;
                                                case 2:
                                                        strQuery += ` site IN (${req.body.filters.sites})`;
                                                        break;
                                                case 3:
                                                        strQuery += ` theme IN (${req.body.filters.themes})`;
                                                        break;
                                                case 4:
                                                        strQuery += ` YEAR(date) = ${req.body.filters.year}`;
                                                        break;
                                                default:
                                                        break;
                                        }
                                }
                        }

                        if (req.body.filters.orderBy && req.body.filters.desc) {
                                strQuery += ` ORDER BY ${req.body.filters.orderBy} DESC`;
                        } else {
                                strQuery += ` ORDER BY ${req.body.filters.orderBy} ASC`;
                        }
                } else {
                        strQuery += ` ORDER BY date DESC`;
                }

                connection.query(strQuery, (err, results) => {
                        if (err)
                                res.json(err);
                        res.json(results);
                });
        }

        public insert(req: Request, res: Response): void {
                let fileName = shortid.generate();
                let fileType = req.body.file.split('/')[1].split(';')[0];

                fs.writeFile(`./files/${fileName}.${fileType}`, req.body.file.split(';base64,').pop(), {encoding: 'base64'}, (err) => {
                        if (err)
                                console.log(err);
                });

                let strQuery: string;
                switch (req.body.type) {
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
                        if (err)
                                res.json(err);
                        res.json(results);
                });
        }
}

export const homeController = new HomeController();
