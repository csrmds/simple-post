require('dotenv').config()
const express = require('express')
const connectDB = require('./config/database')
const routes = require('./routes/routes')
const allowCors= require('./config/cors')


const app= express()
app.use(express.json())

connectDB()

app.use(allowCors)
app.use('/api', routes)


const PORT= 5000  //process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})
