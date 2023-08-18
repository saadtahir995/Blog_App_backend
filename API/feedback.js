import express from 'express'
import db from '../database/conn.js'
import config from '../config/config.js'
const app=express();
app.use(config);
app.post('/feedback',async(req,res)=>{

try{
    const {name,email,message}=req.body;
    const [rows,fields]=await db.execute(`INSERT INTO feedback (name,email,message) VALUES ('${name}','${email}','${message}')`);
    return res.status(200).json({message:"Feedback submitted successfully"})
}
catch(err){
    return res.status(400).json({message:"Error in submitting feedback"})
}
})
export default app;