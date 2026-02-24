const db = require('../config/db');

exports.addComment = async (req, res) => {
    const { comment } = req.body;
    
    await db.query(
        "INSERT INTO ticket_comments(ticket_id, user_id, comment) VALUES(?, ?, ?)",
        [req.params.id, req.user.id, comment]
    );

    res.status(201).json({msg: "Comment is Added"});
}