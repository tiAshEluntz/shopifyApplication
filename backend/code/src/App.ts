import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as flash from 'node-twinkle';
import * as ExpressSession from 'express-session';

import { imageRoutes } from './routes/ImageRouter';

class App {

  public expressApp: express.Application;

  constructor() {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.expressApp.set('view engine', 'pug');
    this.expressApp.use(express.static(__dirname + '/public')); // https://expressjs.com/en/starter/static-files.html

  }

  private middleware(): void {
    this.expressApp.use(logger('dev'));
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(ExpressSession(
      { secret: 'My Secret Key',
        resave: false,
        saveUninitialized: true}));
    this.expressApp.use(flash); // https://www.npmjs.com/package/node-twinkle typed using https://stackoverflow.com/a/53786892/1168342 (solution #2)
  }

  private routes(): void {

    let router = express.Router();

    router.get('/', (req, res, next) => {
      let messages = res.locals.has_flashed_messages() ? res.locals.get_flashed_messages() : [];
      res.render('index', []);
    });

    this.expressApp.use('/', router); 

    this.expressApp.use('/api/v1/jeu', imageRoutes.router);  
  }

}

export default new App().expressApp;
