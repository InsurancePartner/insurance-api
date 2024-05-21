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

const insurance1: Insurance = { 
    insuranceNumber: "123", 
    ssn: "123456-7890", 
    imageFileName: "car.jpg",
};
const insurance2: Insurance = { 
    insuranceNumber: "456", 
    ssn: "098765-4321", 
    imageFileName: "life.jpg", 
};
const insurance3: Insurance = { 
    insuranceNumber: "789", 
    ssn: "012345-6789", 
    imageFileName: "fire.jpg", 
};
const insurance4: Insurance = {
    insuranceNumber: "987",
    ssn: "123456-7890",
    imageFileName: "fire.jpg",
};
const insurance5: Insurance = {
    insuranceNumber: "979",
    ssn: "123456-7890",
    imageFileName: "travel.jpg",
};
const insurance6: Insurance = {
    insuranceNumber: "958",
    ssn: "123456-7890",
    imageFileName: "medical.jpg",
};
const insurance7: Insurance = {
    insuranceNumber: "972",
    ssn: "012345-6789",
    imageFileName: "liability.jpg",
};
const insurance8: Insurance = {
    insuranceNumber: "969",
    ssn: "012345-6789",
    imageFileName: "cyber.jpg",
};

const insurances = [
    insurance1, insurance2, insurance3, insurance4, insurance5, insurance6, insurance7, insurance8
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
    res.send('Greeting from insurance-api!');
});

function generatePresignedUrl(key: string) {
  const params = {
    Bucket: 'insurances-img', 
    Key: key, 
    Expires: 60 * 60, 
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, function (err, url) {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
    });
  });
}

apiRouter.post('/find-insurance', async (req: Request, res: Response) => {
    const { ssn } = req.body;
    const matchedInsurances = insurances.filter(ins => ins.ssn === ssn);
    
    if (matchedInsurances.length > 0) {
        try {
            const insuranceData = await Promise.all(matchedInsurances.map(async insurance => {
                const imageUrl = await generatePresignedUrl(insurance.imageFileName);
                return {
                    insuranceNumber: insurance.insuranceNumber,
                    imageUrl: imageUrl,
                    imageFileName: insurance.imageFileName
                };
            }));
            res.json(insuranceData);
        } catch (err) {
            console.error('Error generating pre-signed URL:', err);
            res.status(500).json({ message: 'Error generating pre-signed URL' });
        }
    } else {
        try {
            const url = await generatePresignedUrl("not_found.jpg");
            res.json([{ insuranceNumber: "-1", imageUrl: url }]);
        } catch (err) {
            console.error('Error generating pre-signed URL:', err);
            res.status(500).json({ message: 'Error generating pre-signed URL' });
        }
    }
});

app.listen(port, () => {
    console.log("Running fetching image version...");
    console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
});