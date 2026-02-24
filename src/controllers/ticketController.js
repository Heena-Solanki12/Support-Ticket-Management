const db = require('../config/db');
const { ticketScheme } = require('../validators/ticketValidators');

const transitions = {
    OPEN: ['IN_PROGRESS'],
    IN_PROGRESS: ['RESOLVED'],
    RESOLVED: ['CLOSED'],
}

exports.CreateTicket = async (req, res) => {
    const {error} = ticketScheme.validate(req.body);

    if(error) return res.status(400).json({msg: error.msg});

    const {title, description, priority} = req.body;

    await db.query(
        "INSERT INTO tickets(title, description, priority, created_by) VALUES(?, ?, ?, ?)"
        [title, description, priority, req.user.id]
    );

    res.status(201).json({msg: "Ticket Created"});
};

exports.getTickets = async (req, res) => {
    let sql = "SELECT * FROM tickets";

    if(req.user.role === "USER"){
        sql += " WHERE created_by=?";
        const [rows] = await db.query(sql, [req.user.id]);
        return res.json(rows);
    }

    if(req.user.role === "SUPPORT"){
        sql += " WHERE assigned_to=?";
        const [rows] = await db.query(sql, [req.user.id]);
        return res.json(rows);
    }

    const [rows] = await db.query(sql);
    res.json(rows); 
};

exports.deleteTicket = async (req, res) => {
    await db.query("DELETE FROM tickets WHERE id=?", [req.params.id]);
    res.status(204).send();
}

exports.assignTicket = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    const [[user]] = await db.query(
        "SELECT r,name role FROM users u JOIN roles r ON u.role_id=r.id WHERE u.id=?",
        [user_id]
    );

    if(user.role === "USER")
        return res.status(400).json({msg: "Cannot assign to user"});

    await db.query("UPDATE tickets SET assigned_to=? WHERE id=?", [user_id, id]);
    res.json({msg: "Ticket Assigned"});
}

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const [[ticket]] = await db.query("SELECT status FROM tickets WHERE id=?", [id]);

    if(!transitions[ticket.status]?.includes(status))
        return res.status(400).json({msg: "Invalid status transition"});

    await db.query("UPDATE tickets SET status=? WHERE id=?", [status, id]);

    await db.query(
        "INSERT INTO ticket_status_log(ticket_id, old_status, new_status, changed_by) VALUES(?, ?, ?, ?)",
        [id, ticket.status, status, req.user.id]
    )
    res.json({msg: "Status Updated"});
}