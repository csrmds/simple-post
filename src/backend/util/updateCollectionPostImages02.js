const mongoose = require('mongoose');

async function updatePostImages() {
    const mongoUri = 'mongodb://localhost:27017/post';

    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`Conexão DB OK: ${conn.connection.host}`);

        const dateLimit = new Date("2025-03-02T01:51:49.740Z");

        // Atualizar documentos que possuem createdAt >= dateLimit
        const result = await mongoose.connection.db.collection('postimages').updateMany(
            { createdAt: { $gte: dateLimit } }, // Filtro por data
            { $set: { source: "web" } } // Atualiza o campo source para "web"
        );

        console.log(`Documentos atualizados: ${result.modifiedCount}`);
    } catch (err) {
        console.error("Erro ao atualizar documentos:", err);
    } finally {
        mongoose.disconnect();
    }
}

updatePostImages();