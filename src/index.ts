import dotenv from 'dotenv';
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002; 

import { CorsOptions } from 'cors';
import { Request, Response } from 'express';
import { setupDatabase } from './config/setupDatabase';
import insuranceRoutes from './routes/insuranceRoutes';

app.use(express.json());

const whitelist = ['http://localhost:3000', 'https://insurance-partner.net']; 

function checkAdditionalSecurity(req: Request) {
  return req.headers['sec-fetch-site'] === 'same-origin';
}
  
app.use((req: Request, res: Response, next: any) => {
const corsOptions: CorsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
            if (origin && whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } 
            else if(origin === undefined)
            {
                if (checkAdditionalSecurity(req)) {
                    callback(null, true); 
                } else {
                    callback(new Error('Not allowed by CORS and security policies'), false);
                }  
            }
            else {
                callback(new Error('Not allowed by CORS'), false); 
            }
        }
    }
    cors(corsOptions)(req, res, next);
});

const apiRouter = express.Router();

app.use('/api', apiRouter);

apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Greeting from insurance-api! (DB version)');
});

app.use('/api', insuranceRoutes);

setupDatabase().then(() => {
    app.listen(port, () => {
        console.log("Running a database version...");
        console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
    });
});
  