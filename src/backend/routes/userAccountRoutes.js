const express= require('express')
const { insertUserAccount, userLoginAttempt, getUserAccounts, getOneUserAccount, verifyCredentials }= require('../controllers/userAccountController')


const router= express.Router()

router.get('/', getUserAccounts)
router.use('/one', getOneUserAccount)
router.use('/password', verifyCredentials)

module.exports= router 