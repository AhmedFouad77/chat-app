const router = require('express').Router();
const auth_controller = require('../controller/auth.controller');



router.post('/signUp',auth_controller.signUp)

router.post('/login',auth_controller.login);

router.post('/logOut',auth_controller.logOut);

router.post('/SendEmailResetPassword',auth_controller.SendEmailResetPassword);

router.post('/resetPassword/:Token',auth_controller.resetPassword);

router.post('/changePassword',auth_controller.changePassword)
module.exports = router;