import { Application } from 'express';
import express from 'express';
import * as bodyParser from 'body-parser';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useExpressServer } from 'routing-controllers';
import { authorizationChecker } from '../auth/authorizationChecker';
import { currentUserChecker } from '../auth/currentUserChecker';
import lusca from 'lusca';
import { env } from '../env';

export const expressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const connection = settings.getData('connection');
        /**
         * We create a new express server instance.
         * We could have also use useExpressServer here to attach controllers to an existing express instance.
         */
        const app = express();
        // app.use(bodyParser.json({limit: '100mb'}));
        // app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
        app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(lusca.xframe('SAMEORIGIN'));
        app.use(lusca.xssProtection(true));
        const expressApp: Application = useExpressServer(app, {
            cors: true,
            classTransformer: true,
            routePrefix: env.app.routePrefix,
            defaultErrorHandler: false,
            /**
             * We can add options about how routing-controllers should configure itself.
             * Here we specify what controllers should be registered in our express server.
             */
            controllers: env.app.dirs.controllers,
            middlewares: env.app.dirs.middlewares,
            interceptors: env.app.dirs.interceptors,

            /**
             * Authorization features
             */
            authorizationChecker: authorizationChecker(connection),
            currentUserChecker: currentUserChecker(connection),
        });
        console.log('express Loader');
        // // parse application/x-www-form-urlencoded
        // expressApp.use(bodyParser.urlencoded({extended: true}));
        // expressApp.use(bodyParser.json({limit: '50mb'}));

        // Run application to listen on given port
        if (!env.isTest) {
            // const http = require('http');
            // const server = http.createServer(expressApp);
            // server.listen(env.app.port, () => {
            //     console.log('listening on 8000---------');
            //   });
            //@ts-ignore
            const server = expressApp.listen(env.app.port);
            console.log('env.isTest');
            settings.setData('express_server', server);
        }

        // Here we can set the data for other loaders
        settings.setData('express_app', expressApp);
        console.log('express Loader');
    }
};
