const db = require('../config/db');
const bcrypt = require('bcrypt');
const { secret, expireIn } = require('../config/jwt');
const { Result } = require('express-validator');

exports.register = async (req, res) => {
    const { name, username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, username, password) VALUES (?, ?, ?)";

}

exports.login = async(req, res) => {
    const {username, password} = req.body;

    const [[user]] = await db.query(
        `SELECT u.*, r.name, role FROM users u join roles r on u.role_id = r.id WHERE email = ?`, 
        [[email]]
    );

    if(!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({msg: "Invalid User or Passweord"});

    const token = jwt.sign({id: user.id, role: user.role}, secret, {expireIn});
    res.json({ token });
}
