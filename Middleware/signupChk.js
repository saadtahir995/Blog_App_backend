import db from "../database/conn.js";

const Signupchk = async (req, res, next) => {
  try {
    const { email} = req.body.formData;
    const [rows, fields] = await db.execute(
      `Select * from Users where email = "${email}"`
    );
    if (rows.length > 0) {
      res.json({ IsSignedUp: false, message: "Email Already Exist" });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
export default Signupchk;
