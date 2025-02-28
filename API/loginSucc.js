import express from 'express'
import config from '../config/config.js'
import Middleware from '../Middleware/loginAuth.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
const app = express();
app.use(config);
app.use(cookieParser());
const Secret_key=process.env.SECRET_KEY
app.post('/login',Middleware, async(req, res) => {
    const user={id:req.id,
        username:req.user
    }
      const token= jwt.sign(user,Secret_key);
      res.cookie('token',token,{ maxAge: 86400000, httpOnly: true,sameSite: 'None',secure:true });
    return res.status(200).json({
        message: 'Login Successful',
        isLoggedin: true,
        token:token
    });
});

// Guest login endpoint
app.post('/guest-login', async(req, res) => {
    const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
    const user = {
        id: guestId,
        username: 'Guest_' + guestId.slice(-4),
        isGuest: true
    }
    const token = jwt.sign(user, Secret_key, { expiresIn: '24h' });
    res.cookie('token', token, { 
        maxAge: 86400000, // 24 hours
        httpOnly: true,
        sameSite: 'None',
        secure: true 
    });
    return res.status(200).json({
        message: 'Guest Login Successful',
        isLoggedin: true,
        isGuest: true,
        username: user.username,
        token: token
    });
});

export default app;
