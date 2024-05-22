import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';
import { Insurance } from "./Insurance";

export const findInsuranceBySSN = async (ssn: string): Promise<Insurance[]> => {
    const [results] = await pool.query<RowDataPacket[]>(
        `SELECT insuranceNumber, ssn, imageFileName FROM Insurances WHERE ssn = ?`, [ssn]
    );
    return results.map(row => ({
        insuranceNumber: row.insuranceNumber,
        ssn: row.ssn,
        imageFileName: row.imageFileName
    }));
};

