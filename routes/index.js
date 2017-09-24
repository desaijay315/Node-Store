const express           = require('express');
const router              = express.Router();
const storeController = require('../controllers/storeController');
const userController  = require('../controllers/userController');
const authController  = require('../controllers/authController');
const reviewController  = require('../controllers/reviewController');
const {catchErrors}  = require('../handlers/errorHandlers');

// Do work here
router.get('/', storeController.getStores);
router.get('/stores', storeController.getStores);
router.get('/add',authController.isLoggedIn, storeController.addStore);

router.post('/add',
  storeController.upload, 
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore));

router.post('/add/:id', 
  storeController.upload, 
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore));

router.get('/stores/:id/edit',catchErrors(storeController.editStore));

router.get('/store/:slug/', catchErrors(storeController.getStoreBySlug));

router.get('/tags/:tag', catchErrors(storeController.getStoreByTags));
router.get('/tags', catchErrors(storeController.getStoreByTags));


//user routes

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

//validate the registration data 
//register the user
//we need to log them in

router.post('/register',
 userController.validateRegister, 
 catchErrors(userController.register),
 authController.login
 );

router.get('/logout', authController.logout);


//user accounts
router.get('/account',authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));

// /forgotpasswrod

router.post('/account/forgot', catchErrors(authController.forgot));

router.get('/account/reset/:token', catchErrors(authController.FindUser), authController.reset);

router.post('/account/reset/:token',
           authController.confirmPasswords, 
           catchErrors(authController.FindUser),
           catchErrors(authController.update)
           );


//api

router.get('/api/search', catchErrors(storeController.searchStores));


router.get('/api/stores/near', catchErrors(storeController.mapstore));
router.get('/map', storeController.mapPage);

router.get('/hearts',authController.isLoggedIn,catchErrors(storeController.getHearts));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));


router.get('/top', catchErrors(storeController.getTopStores));

router.get('/stores/page/:page', catchErrors(storeController.getStores));

module.exports = router;
