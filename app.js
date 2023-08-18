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
app.use(cors());
/*app.use(cors({
    origin: 'http://192.168.43.52:3000',
    credentials: true, // To allow cookies, authorization headers, etc. (important for 'include')
     optionsSuccessStatus:200 
  }));*/
app.use(config);
app.use('/api/auth',LoginRoute);
app.use('/api/newuser',SignupRoute);
app.use('/api/blog',BlogPostApi);
app.use('/api/data',UserDataApi);
app.use('/api/review',FeedbackApi);
app.use('/api/reset-password',PasswordResetApi);
app.listen(9000, () => {
    console.log('Server started!');
    }
);