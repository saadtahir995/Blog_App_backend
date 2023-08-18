import express from 'express'
import config from '../config/config.js'
import db from '../database/conn.js'
import bcrypt from 'bcrypt'
import Middleware from '../Middleware/Chkuser.js'
import nodemailer from 'nodemailer'
const app=express();
app.use(config);
app.post('/request',Middleware, async (req, res) => {
 const resetCode = generateRandomCode(6);
    const {email}=req.body;
    const sql=`UPDATE Users SET reset_code='${resetCode}' WHERE email='${email}'`;
    await db.query(sql);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'autotexter6699@gmail.com',
            pass:'ddbfnkmudinmbxpy'

        }
    });
    const mailOptions = {
        from: 'autotexter6699@gmail.com',
        to: `${email}`,
        subject: 'Password Reset',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f8f8;
              border-radius: 5px;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            p {
              margin: 0 0 10px;
            }
            strong {
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Password Reset</h2>
            <p>Hello there!</p>
            <p>We received a request to reset your password.</p>
            <p>Your password reset code is: <strong>${resetCode}</strong></p>
            <p>Please use this code to reset your password within the next 24 hours.</p>
            <p>If you did not request a password reset, please disregard this email.</p>
            <div class="footer">
              <p>Best regards,</p>
              <p>Your App Team</p>
            </div>
          </div>
        </body>
        </html>
        
        `,
      };
       transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
      }
        );
    res.status(200).json({message:"Reset code sent to your email",
success:true});
})
app.post('/verify', async (req, res) => {
    const { resetCode,email } = req.body;

    const sql = `SELECT * FROM Users WHERE reset_code='${resetCode}' and email='${email}'`;
    const [rows, fields] = await db.query(sql);
    if (rows.length > 0) {
        res.status(200).json({ message: "Code verified. Redirecting to new password Page",
        success:true,
        id:rows[0].user_id });
    }
    else {
        res.status(404).json({ message: "Code not verified" ,
        success:false});
    }
});
app.put('/newpassword', async (req, res) => {
    const { newPassword,email } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = `UPDATE Users SET password='${hashedPassword}' WHERE email='${email}'`;
    await db.query(sql);
    await db.query(`UPDATE Users SET reset_code=null WHERE email='${email}'`);
    res.status(200).json({ message: "Password updated successfully. Redirecting to Login Page" });
});
export default app;


function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }

  

