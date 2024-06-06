const express = require('express');
const UserController = require('../controllers/UserControllers');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const BusinessController = require('../controllers/BusinessController');






const router = express.Router();

router.post('/registration', UserController.registration);
router.post('/findUserByMobile', UserController.findUserByMobile);
router.get('/verifyMobile/:mobile', UserController.verifyMobile);
router.get('/verifyOTP/:mobile/:otp', UserController.verifyOTP);
router.post('/verifyOTPAndUpdate', UserController.verifyOTPAndUpdate);
router.get('/passwordReset/:mobile/:otp/:password', UserController.passwordReset);
router.get('/Login', UserController.Login);
router.get('/findUserCount', UserController.findUserCount);
router.get('/profileRead',AuthMiddleware, UserController.profileRead);
router.post('/profileUpdate', AuthMiddleware, UserController.profileUpdate);



//Business
router.post('/business/addBusiness',AuthMiddleware, BusinessController.addBusiness)
router.get('/business/read',AuthMiddleware, BusinessController.read)
router.post('/business/updateBusiness/:id',AuthMiddleware, BusinessController.updateBusiness)























module.exports = router;