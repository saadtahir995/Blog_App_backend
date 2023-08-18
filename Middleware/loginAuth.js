import db from '../database/conn.js'
import bcrypt from 'bcrypt';


const loginAuth = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const [rows,fields] = await db.execute(`SELECT * FROM Users WHERE email = '${email}'`);
        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid username or password',
                isLoggedin: false
            });
        }
        
        const hashedpwd=rows[0].password;
        const result = await bcrypt.compare(password, hashedpwd);
        if (!result) {
            return res.status(401).json({
                message: 'Invalid username or password',
                isLoggedin: false
            });
        }

        req.user = rows[0].username;
        req.id = rows[0].user_id;
        next();
        
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
export default loginAuth;