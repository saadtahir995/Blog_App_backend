import express from 'express'
import config from '../config/config.js'
import Middleware from '../Middleware/loginAuth.js'
import jwt from 'jsonwebtoken'
const app = express();
app.use(config);
const Secret_key='Fuckoff6969'
app.post('/login',Middleware, async(req, res) => {
    const user={id:req.id,
        username:req.user
    }
      const token= jwt.sign(user,Secret_key);
    return res.status(200).json({
        message: 'Login Successful',
        isLoggedin: true,
        token:token
    });
});
export default app;