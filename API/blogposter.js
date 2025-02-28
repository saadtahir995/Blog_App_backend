import express from 'express';
import config from '../config/config.js'
import db from '../database/conn.js'
import likemiddleware from '../Middleware/likechk.js'
import middleware from '../Middleware/postauthorchk.js'
const app=express();
app.use(config);
app.post('/postmaker',async(req,res)=>{
    try{
        const {title,content,authorid}=req.body.postData;
        const publish_date = new Date();
        const[rows,fields]=await db.execute(`INSERT INTO BlogPosts(title,content,author_id,published_date) VALUES('${title}','${content}','${authorid}','${publish_date}')`);
         return res.status(200).json({message:"Post Data submitted.Refresh page to get Feed"});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
});
app.get('/getallposts/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        // Check if it's a guest user
        if(id.startsWith('guest_')) {
            // For guest users, show all posts without like information
            const [rows, fields] = await db.execute(`
            SELECT
                BlogPosts.*,
                Users.username,
                (SELECT COUNT(*) FROM Comments WHERE Comments.post_id = BlogPosts.post_id) AS comment_count,
                (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = BlogPosts.post_id) AS like_count,
                0 AS is_liked_by_current_user
            FROM BlogPosts
            JOIN Users ON BlogPosts.author_id = Users.user_id
            ORDER BY BlogPosts.published_date DESC;`);
            return res.status(200).json({rows});
        } else {
            // For regular users, show posts with their like information
            const [rows, fields] = await db.execute(`
            SELECT
                BlogPosts.*,
                Users.username,
                (SELECT COUNT(*) FROM Comments WHERE Comments.post_id = BlogPosts.post_id) AS comment_count,
                (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = BlogPosts.post_id) AS like_count,
                IF(Likes.user_id = ${id}, 1, 0) AS is_liked_by_current_user
            FROM BlogPosts
            JOIN Users ON BlogPosts.author_id = Users.user_id
            LEFT JOIN Likes ON Likes.post_id = BlogPosts.post_id AND Likes.user_id = ${id}
            ORDER BY BlogPosts.published_date DESC;`);
            return res.status(200).json({rows});
        }
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
});
app.get('/getposts/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const [rows, fields] = await db.execute(`
        SELECT BlogPosts.*, Users.username
        FROM BlogPosts
        JOIN Users ON BlogPosts.author_id = Users.user_id
        WHERE BlogPosts.author_id = ${id}
        ORDER BY BlogPosts.published_date DESC
      `);
        return res.status(200).json({rows});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.get('/getpost/:id/:authorid',middleware,async(req,res)=>{

    try{
        const {id}=req.params;
        const [rows, fields] = await db.execute(`
        SELECT BlogPosts.*, Users.username
        FROM BlogPosts
        JOIN Users ON BlogPosts.author_id = Users.user_id
        WHERE BlogPosts.post_id = ${id}
        ORDER BY BlogPosts.published_date DESC
      `);
        return res.status(200).json({rows});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.put('/updatepost/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const {title,content}=req.body.postData;
        const publish_date = new Date();
        await db.execute(`UPDATE BlogPosts SET title='${title}',content='${content}',published_date='${publish_date}' WHERE post_id='${id}'`);
        return res.status(200).json({message:"Post updated.Refresh page to get Feed"});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }

}
);

app.post('/addcomment',async(req,res)=>{
    try{
        const {newComment,postId,authorid}=req.body;
        const publish_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await db.execute(`INSERT INTO Comments(post_id,user_id,comment_text,comment_date) VALUES('${postId}','${authorid}','${newComment}','${publish_date}')`);
        const [rows, fields] = await db.execute('SELECT LAST_INSERT_ID() AS comment_id');
         return res.status(200).json({message:"Comment added.",id:rows[0].comment_id});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.get('/getcomments/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const [rows, fields] = await db.execute(`
        SELECT Comments.*, Users.username
        FROM Comments
        JOIN Users ON Comments.user_id = Users.user_id
        WHERE Comments.post_id = ${id}
        ORDER BY Comments.comment_date DESC
      `);
        return res.status(200).json({rows});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.put('/updatecomment',async(req,res)=>{
    try{
        const {commentid,newComment}=req.body;
        const publish_date = new Date();
        await db.execute(`UPDATE Comments SET comment_text='${newComment}',comment_date='${publish_date}' WHERE comment_id='${commentid}'`);
        return res.status(200).json({message:"Comment updated."});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.post('/addlike',likemiddleware,async(req,res)=>{
    try{
        const {postId,authorid}=req.body;
        const publish_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const[rows,fields]=await db.execute(`INSERT INTO Likes(post_id,user_id,like_date) VALUES('${postId}','${authorid}','${publish_date}')`);
         return res.status(200).json({message:"Like added.Refresh page to get Feed"});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.get('/getlikes/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const [rows, fields] = await db.execute(`
        SELECT count(*) as likes
        FROM Likes
        WHERE post_id = ${id}
      `);
        return res.status(200).json({rows});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.delete('/deletelike/:postid/:userid',async(req,res)=>{
    try{
        const {postid,userid}=req.params;
        const[rows,fields]=await db.execute(`DELETE FROM Likes WHERE post_id='${postid}' AND user_id='${userid}'`);
         return res.status(200).json({message:"Like deleted.Refresh page to get Feed"});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.delete('/deletecomment/:commentid',async(req,res)=>{
    try{
        const {commentid}=req.params;
        const[rows,fields]=await db.execute(`DELETE FROM Comments WHERE comment_id='${commentid}'`);
         return res.status(200).json({message:"Comment deleted."});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);
app.delete('/deletepost/:postid',async(req,res)=>{
    try{
        const {postid}=req.params;
// Delete associated comments
await db.execute(`DELETE FROM Comments WHERE post_id='${postid}'`);

// Delete associated likes
await db.execute(`DELETE FROM Likes WHERE post_id='${postid}'`);

// Delete the blog post
await db.execute(`DELETE FROM BlogPosts WHERE post_id='${postid}'`);
         return res.status(200).json({message:"Post deleted.Refresh page to get Feed"});
    }catch(err){
        console.log(err);
        return res.status(501).json({message:"internal Server Error"})
    }
}
);



export default app;
