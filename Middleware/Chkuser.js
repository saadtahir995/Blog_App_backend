import express from 'express'
import config from '../config/config.js'
import db from '../database/conn.js'
const app=express();

const ChkUserEmail=async(req,res,next)=>{
    const {email}=req.body;
    const sql=`SELECT * FROM Users WHERE email='${email}'`;
    const [rows,fields]=await db.query(sql);
    if(rows.length>0){
        next();
    }else{
        res.status(404).json({message:"User not found",
    success:false});
    }
}
export default ChkUserEmail;