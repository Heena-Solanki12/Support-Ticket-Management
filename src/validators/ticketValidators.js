const joi = require('joi');

exports.ticketSchema = joi.object({
    title: joi.string().min(5).required(),
    description: joi.string().min(10).required(),
    priority: joi.string().valid('LOW', 'MEDIUM', 'HIGH')
})