const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


router
    .get('/',
    authController.protected, 
    userController.getAllUsers
);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
    .route('/me')
    .get(
        authController.protected,
        userController.getMe,
        userController.getUser
);

router
    .get('/:id', 
    userController.getUser
);

router
    .patch('/:id',
        authController.protected, 
        userController.updateUser
    );

router
    .delete('/:id',
        authController.protected, 
        userController.deleteUser
);


module.exports = router;