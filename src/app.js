require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Server running successfully 🚀");
});

app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/tickets', require('./routes/ticketRoutes'));

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);