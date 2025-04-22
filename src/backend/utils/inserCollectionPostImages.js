const mongoose = require('mongoose');
//const Post = require('../models/post')
const PostImage = require('../models/postImage')
const mongoUri = 'mongodb://localhost:27017/post';

//const Post = mongoose.model('Post', postSchema);

const images = [
    { postId: '67c3b732aecbcb3e06d822ec', address: 'https://source.unsplash.com/random/1', description: 'Foto bonita' },
  { postId: '67c3b732aecbcb3e06d822ec', address: 'https://source.unsplash.com/random/2', description: 'Imagem legal' },
  { postId: '67c3b732aecbcb3e06d822ed', address: 'https://source.unsplash.com/random/3', description: 'Cena incrível' },
  { postId: '67c3b732aecbcb3e06d822ee', address: 'https://source.unsplash.com/random/4', description: 'Natureza linda' },
  { postId: '67c3b732aecbcb3e06d822ef', address: 'https://source.unsplash.com/random/5', description: 'Arte digital' },
  { postId: '67c3b732aecbcb3e06d822f0', address: 'https://source.unsplash.com/random/6', description: 'Pôr do sol' },
  { postId: '67c3b732aecbcb3e06d822f1', address: 'https://source.unsplash.com/random/7', description: 'Montanha alta' },
  { postId: '67c3b732aecbcb3e06d822f2', address: 'https://source.unsplash.com/random/8', description: 'Paisagem azul' },
  { postId: '67c3b732aecbcb3e06d822f3', address: 'https://source.unsplash.com/random/9', description: 'Cidade à noite' },
  { postId: '67c3b732aecbcb3e06d822f4', address: 'https://source.unsplash.com/random/10', description: 'Retrato elegante' },
  { postId: '67c3b732aecbcb3e06d822f5', address: 'https://source.unsplash.com/random/11', description: 'Mar azul' },
  { postId: '67c3b732aecbcb3e06d822f5', address: 'https://source.unsplash.com/random/12', description: 'Cachoeira linda' }
];

async function inserPostImages() {
    try {
        const conn = await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Conexão DB OK: ${conn.connection.host}`);

        const inserted = await PostImage.insertMany(images);
        console.log('Dados inseridos:', inserted);
    } catch (err) {
        console.error("Erro ao inserir images", err);
    } finally {
        mongoose.disconnect();
    }
}

inserPostImages();
