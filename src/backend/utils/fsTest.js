const fs = require('fs/promises')
const path = require('path')
const dotenv= require('dotenv')

dotenv.config({
    path: path.resolve(__dirname, '../../../.env')
})


const url = process.env.BACKEND_URL

const postId= "6823efc10e7f8ac2964b9a40"

const folderAddress= path.join(__dirname, `../files/postImages/${postId}`)
//const folderAddress=  path.join(`${process.env.NEXT_PUBLIC_POST_IMAGE_PATH}${postId}`) 

//console.log("process.env: ", process.env)
// console.log("process.env: ", process.env.NEXT_PUBLIC_POST_IMAGE_PATH)
// console.log("dirname: ", __dirname)
// console.log("teste path: ", path.join(process.env.NEXT_PUBLIC_POST_IMAGE_PATH, postId))

console.log("folderAddress: ", folderAddress)

// async function deleteFolder() {
//     const resp= await fs.rm(folderAddress, {recursive: true, force: true}, (err)=> {
//         if (err) {
//             console.error("Error deleting folder:", err);
//         } else {
//             console.log("Folder deleted successfully");
//         }
//     })  
// }

// fs.rm(folderAddress, {recursive: true, force: true}, (err)=> {
//         if (err) {
//             console.error("Error deleting folder:", err);
//         } else {
//             console.log("Folder deleted successfully");
//         }
//     })

//deleteFolder()



fs.access(folderAddress)
    .then(() => console.log("Diretório existe"))
    .catch(() => console.log("Diretório não existe"))