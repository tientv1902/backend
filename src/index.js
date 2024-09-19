const express = require("express");
const dotenv = require('dotenv');
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.get('/', (req, res)=>{
    res.send('hello worldsss')
})

app.listen(port, () => {
    console.log("Server is running in port: ", + port)
})