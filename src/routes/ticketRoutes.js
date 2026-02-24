const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ticket = require('../controllers/ticketController');

router.post('/', auth, role('USER', 'MANAGER'), ticket.CreateTicket);

router.get('/', auth, ticket.getTickets);

router.patch('/:id/assign', auth, role('MANAGER', 'SUPPORT'), ticket.assignTicket)

router.patch('/:id/status', auth, role('MANAGER', 'SUPPORT'), ticket.updateStatus)

router.delete('/:id', auth, role('MANAGER'), ticket.deleteTicket);


module.exports = router;