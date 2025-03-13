const mongoose = require('mongoose');
const Post = require('../models/post')
const mongoUri = 'mongodb://localhost:27017/post';

//const Post = mongoose.model('Post', postSchema);

const posts = [
    { title: "Post 1", content: "Conteúdo 1", userAccountId: "679aed368f982150237a6f3f" },
    { title: "Post 2", content: "Conteúdo 2", userAccountId: "679aed368f982150237a6f3f" },
    { title: "Post 3", content: "Conteúdo 3", userAccountId: "679aed368f982150237a6f41" },
    { title: "Post 4", content: "Conteúdo 4", userAccountId: "679aed368f982150237a6f3b" },
    { title: "Post 5", content: "Conteúdo 5", userAccountId: "679aed368f982150237a6f41" },
    { title: "Post 6", content: "Conteúdo 6", userAccountId: "67a56684e1f94bcb12ef4c27" },
    { title: "Post 7", content: "Conteúdo 7", userAccountId: "67a56684e1f94bcb12ef4c27" },
    { title: "Post 8", content: "Conteúdo 8", userAccountId: "679aed368f982150237a6f3d" },
    { title: "Post 9", content: "Conteúdo 9", userAccountId: "679aed368f982150237a6f3b" },
    { title: "Post 10", content: "Conteúdo 10", userAccountId: "679aed368f982150237a6f3d" }
];

async function insertPosts() {
    try {
        const conn = await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Conexão DB OK: ${conn.connection.host}`);

        const inserted = await Post.insertMany(posts);
        console.log('Dados inseridos:', inserted);
    } catch (err) {
        console.error("Erro ao inserir posts", err);
    } finally {
        mongoose.disconnect();
    }
}

insertPosts();
