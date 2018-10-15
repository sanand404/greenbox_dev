const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.load();

const mySqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
});

mySqlConnection.connect((err) => {
    if(err){
        throw err;
    }
});

export default mySqlConnection;