const cloudinary = require('../config/cloudinary.js')
const fs = require('fs')



const uploadPostImage = async (req, res) => {
    console.log("-----cloudinaryController uploadPostImage-----")
    if (!req.files.length || !req.body.postId ) {
        console.log("Não foi identificado postId ou arquivos anexados")
        return
    }

    try {        
        const uploadResults= []
        const postId= req.body.postId
        let order= 0

        for (const file of req.files) {
            const filePath= file.path
            const response = await cloudinary.uploader.upload(filePath, {
                folder: 'post-images',
                public_id: `${postId}_${order}`
            })
            order++
            uploadResults.push(response)
        }

        for (const file of req.files) {
            fs.unlinkSync(file.path)
        }
        
        //res.status(200).json({url: response.secure_url, public_id: result.public_id})
        res.status(200).json(uploadResults)
    } catch (err) {
        res.status(500).json({ error: 'Erro no upload da imagem', details: err });
    }
}

module.exports = {uploadPostImage}