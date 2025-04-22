const fs = require('fs/promises')
const path = require('path')
const PostImage= require('../models/postImage')


function getPathInfo(address) {

    let extension= path.extname(address)
    let name= path.basename(address, extension)
    let directory= address.replace(name+extension, "")

    return { directory, name, extension }
}


async function fileListRenameOrder(postId) {
   
    try {
        const images= await PostImage.find({postId: postId}).sort({order: 1})
        let listFile= []
        let listNewFileName= []
        
        //laço para renomear os arquivos para um nome temporario
        images.map(async (image)=> {
            console.log("image address: ", image.address)
            const fileAddress= getPathInfo(image.address)
            console.log("file address: ", fileAddress)
            const tempFileName= `${fileAddress.directory}${fileAddress.name}_temp${fileAddress.extension}`
            listFile.push({
                address: tempFileName, 
                id: image._id.toString()
            })
            await fs.rename(image.address, tempFileName)
        })
        console.log("ListFileTemp: ", listFile)

        //renomeia os arquivos para um nome correto e atualiza no banco de dados
        listFile.map(async (file, i) => {
            console.log("chamou listFile.map")
            const fileAddress= getPathInfo(file.address)
            let fileNewName = `${fileAddress.directory}image_${i}${fileAddress.extension}`
            console.log("Origem: ", file.address)
            console.log("Destin: ", fileNewName)
            await fs.rename(file.address, fileNewName)
            
            const imageUpdated = await PostImage.findByIdAndUpdate(
                file.id, 
                { address: fileNewName, order: i }, 
                { new: true }
            )
            
            listNewFileName.push({ address: fileNewName, id: file.id, order: i })
            console.log("ImageUpdated: ", imageUpdated)
        })
        console.log("listNewFileName: ", listNewFileName)

        return {listFile, listNewFileName}
    } catch(err) {
        console.log("Erro ao testar arquivo: ", err)
        return { message: "Erro ao testar arquivo: ", error: err}
    }

}

async function lastImageOrder(postId) {
    try {
        const images= await PostImage.find({postId: postId}).sort({order: 1})
        const lastOrder= images[images.length -1].order +1
        return parseInt(lastOrder) 
    } catch(err) {
        console.log("Erro ao pegar informações dos arquivos: ", err)
        return 0
    }
}


module.exports= {
    getPathInfo,
    fileListRenameOrder,
    lastImageOrder
}