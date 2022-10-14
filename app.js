const express = require('express')
const authen = require("./src/utils/middleware/authen");
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
require("dotenv").config();
const database = require('./src/utils/databaseConn/connection')

// CONFIG LIBRARY
app.use(cors())
require('dotenv').config()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

//CONNECT TO DATABASE
database.isConnected()

//REQUIRE ROUTES
const userRoute = require('./src/routes/user')

//ROUTES DEFINE
app.use('/user', userRoute)
app.use("/", authen, (req, res)=>{
    res.send('Welcome to world!');
})

app.listen(process.env.PORT , () => {
  console.log(`listening on http://localhost:${process.env.PORT}`);
});