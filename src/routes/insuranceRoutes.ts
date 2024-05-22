import express from 'express';
import { Router, Request, Response } from 'express';
import s3 from '../config/s3Client';
import * as insuranceModel from '../models/insuranceModel';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const router = Router();

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

router.post('/find-insurance', async (req: Request, res: Response) => {
    try {
      const { ssn } = req.body;
      const insurances = await insuranceModel.findInsuranceBySSN(ssn);
      if (insurances.length) {
        const insuranceData = await Promise.all(insurances.map(async insurance => {
          const imageUrl = await generatePresignedUrl(insurance.imageFileName);
          return {
            insuranceNumber: insurance.insuranceNumber,
            imageUrl: imageUrl,
            imageFileName: insurance.imageFileName
          };
        }));
        res.json(insuranceData);
      } else {
        const url = await generatePresignedUrl("not_found.jpg");
        res.json([{ insuranceNumber: "-1", imageUrl: url }]);
      }
    } catch (err) {
      console.error('Database or AWS error:', err);
      res.status(500).json({ message: 'Error fetching insurance data' });
    }
});

export default router;
