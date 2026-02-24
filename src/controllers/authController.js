const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await db.query(
    `SELECT u.*, r.name role FROM users u JOIN roles r ON u.role_id=r.id WHERE email=?`,
    [email]
  );

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn });

  res.json({ token });
};