const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const [[roleRow]] = await db.query("SELECT id FROM roles WHERE name = ?", [role]);

    const hash = await bcrypt.hash(password, 10);

    await db.query(
        "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)", 
        [name, email, hash, roleRow.id]
    );

    res.status(201).json({msg: "User Created"});
};

exports.getUsers = async (req, res) => {
  const [users] = await db.query(
    "SELECT u.id,name,email,r.name role FROM users u JOIN roles r ON u.role_id=r.id"
  );
  res.json(users);
};