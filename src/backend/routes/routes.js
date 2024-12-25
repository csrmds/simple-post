import express from 'express'
const router = express.Router()

router.get('/rota', (req, res)=> {
    res.send({type: 'ab', messagage: 'mensagem de retorno OK'})
})




export default router