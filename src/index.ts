import dotenv from 'dotenv';
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002; 
import { Insurance } from "../src/models/Insurance";
import { CorsOptions } from 'cors';
import { Request, Response } from 'express';
import s3 from './config/s3Client';
import IMAGE_BASE_URL from './config/imageBaseUrl';

const insurance1: Insurance = { 
    insuranceNumber: "123", 
    ssn: "123456-7890", 
    insuranceType: "car_accident", 
    imageUrl: `${IMAGE_BASE_URL}/car_accident.jpg` 
};
const insurance2: Insurance = { 
    insuranceNumber: "456", 
    ssn: "098765-4321", 
    insuranceType: "life", 
    imageUrl: `${IMAGE_BASE_URL}/life.jpg` 
};
const insurance3: Insurance = { 
    insuranceNumber: "789", 
    ssn: "012345-6789", 
    insuranceType: "fire", 
    imageUrl: `${IMAGE_BASE_URL}/fire.jpg` 
};

const insurances = [
    insurance1, insurance2, insurance3
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
                //if (checkAdditionalSecurity(req)) {
                    callback(null, true); 
                //} else {
                //    callback(new Error('Not allowed by CORS and security policies'), false);
                //}  
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
    res.send('Greeting from insurance-api!');
});

function generatePresignedUrl(key: string) {
  //console.log("INSIDE generatePresignedUrl...");
  //console.log("key: ", key);
  const params = {
    Bucket: 'insurances-img', 
    Key: key, 
    Expires: 60 * 60, 
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, function (err, url) {
        if (err) {
          //console.log("Error generating pre-signed URL", err);
          reject(err);
        } else {
          //console.log("Pre-signed URL (promise version):", url);
          resolve(url);
        }
    });
  });
}

apiRouter.post('/find-insurance', async (req: Request, res: Response) => {
    const { ssn } = req.body;
    const insurance = insurances.find(ins => ins.ssn === ssn);
    
    if (insurance) {
        try {
            const url = await generatePresignedUrl(insurance.insuranceType+".jpg");
            //console.log("GENERATED URL: ", url);
            res.json({ message: `Your insurance number is ${insurance.insuranceNumber}`, imageUrl: url });
        } catch (err) {
            console.error('Error generating pre-signed URL:', err);
            res.status(500).json({ message: 'Error generating pre-signed URL' });
        }
    } else {
        try {
            const url = await generatePresignedUrl("not_found.jpg");
            //console.log("GENERATED URL: ", url);
            res.json({ message: "No insurance found", imageUrl: url });
        } catch (err) {
            console.error('Error generating pre-signed URL:', err);
            res.status(500).json({ message: 'Error generating pre-signed URL' });
        }
    }
});

app.listen(port, () => {
    console.log("Running fetching image version...");
    console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
    //console.log("IMAGE_BASE_URL: ", IMAGE_BASE_URL);
});