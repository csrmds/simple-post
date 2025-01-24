import dotenv from 'dotenv'
import express from 'express'
import connectDB from './config/database.js'
import routes from './routes/routes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import allowCors from './config/cors.js'
import path from 'path'
import { fileURLToPath } from 'url'

//adaptação para utilizar o __dirname no ES Module
const __filename= fileURLToPath(import.meta.url)
const __dirname= path.dirname(__filename)

dotenv.config()
const app= express()

connectDB()

app.use(express.json())
app.use(allowCors)
app.use('/api', routes)
app.use('/post', postRoutes)
app.use("/images", express.static(path.join(__dirname, "files", "postImages")));
app.use('/comment', commentRoutes)


const PORT= process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})
