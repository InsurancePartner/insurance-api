const mysql = require('mysql2/promise');

console.log("INSIDE scripts/populate-initial-data.ts");
//process.env.DB_HOST = process.env.DB_HOST?.replace(":3306", "");

async function populateData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'insuranceDB'
  });

  try {
    const [rows] = await connection.execute("SELECT COUNT(*) AS count FROM Insurances");
    if (rows[0].count === 0) {
      await connection.execute("INSERT INTO Insurances (insuranceNumber, ssn, imageFileName) VALUES ('123', '123456-7890', 'car.jpg');");
      await connection.execute("INSERT INTO Insurances (insuranceNumber, ssn, imageFileName) VALUES ('456', '098765-4321', 'life.jpg');");
      await connection.execute("INSERT INTO Insurances (insuranceNumber, ssn, imageFileName) VALUES ('789', '012345-6789', 'fire.jpg');");
      await connection.execute("INSERT INTO Insurances (insuranceNumber, ssn, imageFileName) VALUES ('987', '123456-7890', 'fire.jpg');");
      await connection.execute("INSERT INTO Insurances (insuranceNumber, ssn, imageFileName) VALUES ('979', '123456-7890', 'travel.jpg');");
      await connection.execute("INSERT INTO Insurances (insuranceNumber, ssn, imageFileName) VALUES ('958', '123456-7890', 'medical.jpg');");
      await connection.execute("INSERT INTO Insurances (insuranceNumber, ssn, imageFileName) VALUES ('972', '012345-6789', 'liability.jpg');");
      await connection.execute("INSERT INTO Insurances (insuranceNumber, ssn, imageFileName) VALUES ('969', '012345-6789', 'cyber.jpg');");
      console.log('Data populated successfully');
    } else {
      console.log('Table is not empty, skipping data insertion');
    }
  } catch (error) {
    console.error('Failed to populate data:', error);
  } finally {
    await connection.end();
  }
}

populateData();
