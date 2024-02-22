/*
 * spurtcommerce API
 * version 4.5
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as path from 'path';
// import { ROUTER } from '../plugin-manager/routes/index';
import session from 'express-session';
import expressValidator from 'express-validator';
import { env } from '../env';

export const spurtConnectLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const passport = require('passport');
        const MySQLStore = require('express-mysql-session')(session);
        const expressApp = settings.getData('express_app');
        const options = {
            host: env.db.host,
            port: env.db.port,
            user:  env.db.username,
            password: env.db.password,
            database: env.db.database,
        };
        const sessionStore = new MySQLStore(options);
        expressApp
            // view engine setup
            .set('views', path.join(__dirname, '../../', 'views'))
            .set('view engine', 'ejs')
            .set('layout', 'pages/layouts/common')
            .use(session({
                store: sessionStore,
                resave: true,
                saveUninitialized: true,
                secret: '$$secret*&*((',
            }))
            .use(passport.initialize())
            .use(passport.session())
            .use(expressValidator())
            .use((req, res, next) => {
                res.locals.user = req.user;
                next();
            });

        // for (const route of ROUTER) {
        //     expressApp.use(route.path, route.middleware, route.handler);
        // }

    }
};
