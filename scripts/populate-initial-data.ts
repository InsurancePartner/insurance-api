const mysql = require('mysql2/promise');

console.log("AFTER the creation of a private route table...");
console.log("AFTER adding the Lambda security group to the Lambda function...");
console.log("INSIDE scripts/populate-initial-data.ts");
//console.log("process.env.DB_HOST (before trimming): ", process.env.DB_HOST);
process.env.DB_HOST = process.env.DB_HOST?.replace(":3306", "");
console.log("process.env.DB_HOST (after trimming): ", process.env.DB_HOST);

export const handler = async (event: any, context: any) => {
  console.log("Lambda Function triggered");
  console.log("Attempting to connect to database");
  console.log("Port number explicitly specified: 3306");
  try {
    console.log("Testing database connection");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'insuranceDB',
      port: 3306,
    });
    console.log("Database connection established");
    await connection.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Connection successful" }),
    };
  } catch (error) {
    console.error('Connection failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Connection failed", error }),
    };
  }

/*
  console.log("Database connection established");

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
  }*/
}
