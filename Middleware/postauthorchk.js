import express from 'express';
import db from '../database/conn.js';
import config from '../config/config.js';
const app=express();
app.use(config);
 const postauthorchk=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {authorid}=req.params;
        const [rows, fields] = await db.execute(`
    SELECT * FROM BlogPosts WHERE post_id='${id}' and author_id='${authorid}'`);

        if(rows.length>0){
            next();
        }
        else{
            return res.status(501).json({message:"You are not the author of this post"})
        }
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
export default postauthorchk;
