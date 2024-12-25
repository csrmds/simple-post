import dotenv from 'dotenv'
import express from 'express'
import connectDB from './config/database.js'
import routes from './routes/routes.js'
import postRoutes from './routes/postRoutes.js'
import allowCors from './config/cors.js'

dotenv.config()
const app= express()

connectDB()

app.use(express.json())
app.use(allowCors)
app.use('/api', routes)
app.use('/post', postRoutes)


const PORT= process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})
