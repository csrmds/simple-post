const mongoose = require('mongoose')

async function updateComments() {
    const mongoUri= 'mongodb://localhost:27017/post'

    try {
        const conn= await mongoose.connect(mongoUri);
        console.log(`Conexão DB OK: ${conn.connection.host}`)

        const response = await mongoose.connection.collection('comments').updateMany(
            { postId: { $exists: true } },
            { $rename: { postId: 'foreignId' } }
        )
        console.log('Dados atualizados: ', response.modifiedCount)

    } catch (err) {
        console.log("erro ao atulizar a collection", err)
    } finally {
        mongoose.disconnect()
    }
}


updateComments()