const express = require ('express')
const app = express()
require ("dotenv").config();
const port = process.env.PORT
const dbSetup = require('./dbconfig');
const router = require('./Routes/userRouter');
dbSetup()

app.use(express.json())

app.use('/api/user', router)

app.listen(port, ()=>{
    console.log(`app started on port ${port}`)
})