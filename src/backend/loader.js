const dotenv= require('dotenv')
const express= require('express')
const connectDB= require('./config/database')
//const routes= require('./routes/routes')
const postRoutes= require('./routes/postRoutes')
const commentRoutes= require('./routes/commentRoutes')
const userAccountRoutes= require('./routes/userAccountRoutes')
const likeRoutes= require('./routes/likeRoutes')
const allowCors= require('./config/cors')
const path= require('path')

dotenv.config()
const app= express()

connectDB()

app.use(express.json())
app.use(allowCors)
app.use('/api/useraccount', userAccountRoutes)
app.use('/post', postRoutes)
app.use("/images", express.static(path.join(__dirname, "files", "postImages")));
app.use("/images/avatar", express.static(path.join(__dirname, "files", "userAvatar")));
app.use('/comment', commentRoutes)
app.use('/like', likeRoutes)


const PORT= process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})
