import mysql2 from 'mysql2/promise'

console.log("HOST:", process.env.HOST);
console.log("USER:", process.env.USER);
console.log("PWD:", process.env.PASSWORD);
console.log("DB:", process.env.DB);
const conn= mysql2.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    });
export default conn;
