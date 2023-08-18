import express from 'express';
import config from './config/config.js';
import LoginRoute from './API/loginSucc.js';
import SignupRoute from './API/Signup.js';
import BlogPostApi from './API/blogposter.js';
import UserDataApi from './API/Userdata.js';
import FeedbackApi from './API/feedback.js';
import PasswordResetApi from './API/ResetPwd.js';
import cors from 'cors'
const app = express();
app.use(cors({
    origin: ["https://blog-app-frontend-sandy.vercel.app"],
    credentials: true, // To allow cookies, authorization headers, etc. (important for 'include')
     optionsSuccessStatus:200 
  }));
  app.get('/', (req, res) => {
    res.json('Hello World!');
    });
app.use(config);
app.use('/api/auth',LoginRoute);
app.use('/api/newuser',SignupRoute);
app.use('/api/blog',BlogPostApi);
app.use('/api/data',UserDataApi);
app.use('/api/review',FeedbackApi);
app.use('/api/reset-password',PasswordResetApi);
app.listen(3001, () => {
    console.log('Server started!');
    }
);