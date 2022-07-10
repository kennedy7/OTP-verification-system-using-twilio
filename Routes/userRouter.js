const router = require ('express').Router()
const{signUp, verifyOtp} = require('../Controllers/userController')

router.post('/signup',  signUp)
router.post('/signup/verify',  verifyOtp)

module.exports = router;