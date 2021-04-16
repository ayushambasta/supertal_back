const express =  require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
app.use(express.json());
const User = require('./model/User');

//Connect to DB
mongoose.connect(process.env.DB_PASSCODE, () => {
    console.log("Connected to DB");
});

//Middleware
app.use(cors());
//Route
const authRoute = require('./routes/auth');
app.use('/api/user', authRoute);

app.listen(3001, () => {
    console.log("Hyui")
});
