const mongoose = require('mongoose');

async function updatePostImages() {
    const mongoUri = 'mongodb://localhost:27017/post';

    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`Conexão DB OK: ${conn.connection.host}`);

        // Atualizar todos os documentos adicionando o campo 'source' com valor padrão "local"
        const result = await mongoose.connection.db.collection('postimages').updateMany(
            { source: { $exists: false } }, // Garante que o campo não exista antes de adicionar
            { $set: { source: "local" } }
        );

        console.log(`Documentos atualizados: ${result.modifiedCount}`);
    } catch (err) {
        console.error("Erro ao atualizar documentos:", err);
    } finally {
        mongoose.disconnect();
    }
}

updatePostImages();