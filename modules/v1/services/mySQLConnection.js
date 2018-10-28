import mysql from "mysql";
import dotenv from "dotenv";
import logger from "../../../lib/logger";

dotenv.load();

const mySqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true
});

mySqlConnection.connect(err => {
  if (err) {
    logger.info("MySQL error ", err);
    throw err;
  }
});

export default mySqlConnection;
