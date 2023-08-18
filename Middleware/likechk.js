import db from '../database/conn.js'
import express from 'express';
import config from '../config/config.js'
const app=express();
app.use(config);

const likechk=async(req,res,next)=>{
    try{
        const {postId,authorid}=req.body;
        const [rows, fields] = await db.execute(`
        SELECT * FROM Likes WHERE post_id = ${postId} AND user_id = ${authorid};
      `);
        if(rows.length>0){
            return res.status(200).json({message:"Already Liked"});
        }else{
            next();
        }
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
export default likechk;