require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/auth', require('./src/routes/authRoutes'));
app.use('/users', require('./src/routes/userRoutes'));
app.use('/tickets', require('./src/routes/ticketRoutes'));

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);