const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002; 
import { Insurance } from "../src/models/Insurance";
import { CorsOptions } from 'cors';
import { Request, Response } from 'express';

const insurance1: Insurance = { insuranceNumber: "123", dateOfAccident: "2023-11-15", ssn: "123456-7890" };
const insurance2: Insurance = { insuranceNumber: "456", dateOfAccident: "2023-12-12", ssn: "098765-4321" };

const insurances = [
    insurance1, insurance2
];

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
    res.send('Greeting from insurance-api! (CI/CD) (CORS), checkAdditionalSecurity: ');
});

apiRouter.post('/find-insurance', (req: Request, res: Response) => {
    const { dateOfAccident, ssn } = req.body;
    const insurance = insurances.find(ins => ins.dateOfAccident === dateOfAccident && ins.ssn === ssn);
    if (insurance) {
        res.json({ message: `(CORS) Your insurance number is ${insurance.insuranceNumber}` });
    } else {
        res.json({ message: "No insurance found" });
    }
});

app.listen(port, () => {

});