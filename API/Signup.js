import express from 'express';
import config from '../config/config.js';
import Middleware from '../Middleware/signupChk.js';
import db from '../database/conn.js';
import bcrypt from 'bcrypt';
const app = express();
app.use(config);
app.post('/signup', Middleware, async (req, res) => {
    try {
        const reg_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const { username, email, password} = req.body.formData;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await db.execute(`INSERT INTO Users (username,email,password,registration_date) VALUES ('${username}','${email}','${hashedPassword}','${reg_date}')`);
        res.json({
        IsSignedUp: true,
        message: 'Signup Successful'
        });
    } catch (err) {
        console.log(err);
    }
    });
    export default app;
