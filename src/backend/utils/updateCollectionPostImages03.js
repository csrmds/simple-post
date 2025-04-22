const mongoose = require('mongoose');

async function updatePostImages() {
    const mongoUri = 'mongodb://localhost:27017/post';
    const conn = await mongoose.connect(mongoUri);
    console.log(`Conexão DB OK: ${conn.connection.host}`);

    const updateList = [
        { postId: '67c3b732aecbcb3e06d822ec', address: 'https://picsum.photos/id/101/600/400' },
        { postId: '67c3b732aecbcb3e06d822ec', address: 'https://picsum.photos/id/102/600/400' },
        { postId: '67c3b732aecbcb3e06d822ed', address: 'https://picsum.photos/id/103/600/400' },
        { postId: '67c3b732aecbcb3e06d822ee', address: 'https://picsum.photos/id/104/600/400' },
        { postId: '67c3b732aecbcb3e06d822ef', address: 'https://picsum.photos/id/105/600/400' },
        { postId: '67c3b732aecbcb3e06d822f0', address: 'https://picsum.photos/id/106/600/400' },
        { postId: '67c3b732aecbcb3e06d822f1', address: 'https://picsum.photos/id/107/600/400' },
        { postId: '67c3b732aecbcb3e06d822f2', address: 'https://picsum.photos/id/108/600/400' },
        { postId: '67c3b732aecbcb3e06d822f3', address: 'https://picsum.photos/id/109/600/400' },
        { postId: '67c3b732aecbcb3e06d822f4', address: 'https://picsum.photos/id/110/600/400' },
        { postId: '67c3b732aecbcb3e06d822f5', address: 'https://picsum.photos/id/111/600/400' },
        { postId: '67c3b732aecbcb3e06d822f5', address: 'https://picsum.photos/id/112/600/400' }
    ]

    try {
        

        updateList.map((update)=> {
            console.log("postId: ", update.postId, " -> ", update.address)
            // Atualizar documentos 
            const result = mongoose.connection.db.collection('postimages').findOneAndUpdate(
                {postId: new mongoose.Types.ObjectId(update.postId)},
                { $set: { address: update.address } }   
            );
            })

        

        //console.log(`Documentos atualizados: ${result.modifiedCount}`);
    } catch (err) {
        console.error("Erro ao atualizar documentos:", err);
    } finally {
        mongoose.disconnect();
    }
}

updatePostImages();