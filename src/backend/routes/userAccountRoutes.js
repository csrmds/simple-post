const express= require('express')
const { insertUserAccount, userLoginAttempt, getUserAccounts, getOneUserAccount, verifyCredentials, verifyGoogleAccountRegister }= require('../controllers/userAccountController')


const router= express.Router()

router.use('/', getUserAccounts)
router.use('/one', getOneUserAccount)
router.use('/password', verifyCredentials)
router.use('/verifygoogleaccount', verifyGoogleAccountRegister)

module.exports= router 