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

const whitelist = ['http://localhost:3000', 'https://insurance-partner.net']; 

const corsOptions: CorsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (origin && whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false); 
      }
    }
}

app.use(express.json());

app.use(cors(corsOptions));

const apiRouter = express.Router();

app.use('/api', apiRouter);

apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Greeting from insurance-api! (CI/CD version, CORS)');
});

apiRouter.post('/find-insurance', (req: Request, res: Response) => {
    console.log("req: ", req);
    const { dateOfAccident, ssn } = req.body;
    const insurance = insurances.find(ins => ins.dateOfAccident === dateOfAccident && ins.ssn === ssn);
    if (insurance) {
        res.json({ message: `Your insurance number is ${insurance.insuranceNumber}` });
    } else {
        res.json({ message: "No insurance found" });
    }
});

app.listen(port, () => {

});