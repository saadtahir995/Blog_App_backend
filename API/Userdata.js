import express from 'express'
import db from '../database/conn.js'
import config from '../config/config.js'
const app=express();
app.use(config);
app.get('/userdata/:id',async(req,res)=>{
    try{
        const{id}=req.params;
        const query=`SELECT email from Users where user_id=${id}`;
        const[rows,fields]=await db.execute(query);
        return res.status(200).json({email:rows[0].email});
    }
    catch(err)
    {
        console.log(err);
        return res.status(501).json({message:'Internal Server Error'});
    }
});
export default app;