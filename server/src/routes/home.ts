import { Express } from 'express';
import { homeController } from '../controllers/home';

export default class HomeRoute 
{
	constructor(app: Express) 
	{
		app.route('/api/actualite').get(homeController.actualite);
		app.route('/api/insertActualite').post(homeController.insertActualite);

		app.route('/api/crterrain').get(homeController.crterrain);
		app.route('/api/insertCrterrain').post(homeController.insertCrterrain);

		app.route('/api/login').post(homeController.login);
		app.route('/api/selectUserInfo').post(homeController.selectUserInfo);
	}
}
