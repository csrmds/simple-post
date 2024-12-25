import mongoose from 'mongoose';
//mongoose.Promise= global.Promise

const connectDB= async()=> {
    try {
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conexão DB OK: ${conn.connection.host}`)
    } catch(error) {
        console.error(`Erro ao conextar: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB
