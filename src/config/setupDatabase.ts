import { pool } from './database';

const createInsurancesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Insurances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      insuranceNumber VARCHAR(255) NOT NULL,
      ssn VARCHAR(255) NOT NULL,
      imageFileName VARCHAR(255) NOT NULL
    )
  `);
  console.log("Insurances table checked/created successfully");
};

export const setupDatabase = async () => {
  try {
    await createInsurancesTable();
  } catch (error) {
    console.error('Failed to setup database tables:', error);
    process.exit(1);  
  }
};
