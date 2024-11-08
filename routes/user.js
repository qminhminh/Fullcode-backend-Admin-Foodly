const router = require('express').Router();
const userController = require('../controllers/userController')
const {verifyTokenAndAuthorization} = require('../middleware/verifyToken');

router.get("/verify/:otp",verifyTokenAndAuthorization, userController.verifyAccount);
router.get("/verify_phone/:phone",verifyTokenAndAuthorization, userController.verifyPhone);

router.get("/",verifyTokenAndAuthorization, userController.getUser);

router.get("/all-users", userController.getUsers);

router.put("/updateToken/:token",verifyTokenAndAuthorization, userController.updateFcm);

router.post("/update-profile-admin", userController.updateProfileAdmin);

router.get("/get-profile-admin/:id", userController.getProfileAdmin);

module.exports = router;