import mysql2 from 'mysql2/promise'
const conn= mysql2.createPool({
    host: 'b92d5el9jwxw5ut28zdy-mysql.services.clever-cloud.com',
    user: 'uqkuuw4lup3e5m4i',
    password: 'v3krqx0LWLwz9bjsRZkM',
    database: 'b92d5el9jwxw5ut28zdy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    });
export default conn;
