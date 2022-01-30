const express = require('express');
const router = require('express-promise-router')();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
// const { forwardAuthenticated } = require('../config/auth');
const { validateBody, schemas } = require('../helpers/routeHelpers')
const passportConf = require('../passport')
const UserController = require('../controllers/users');
const passportJWT = passport.authenticate('jwt', { session: false });
const passportSignIn = passport.authenticate('local', { session: false });

router.route('/signup').post(validateBody(schemas.regSchema), UserController.signUp); // updated
router.route('/signin').post(validateBody(schemas.authSchema), passportSignIn, UserController.signIn); // updated
router.get('/secret', passportJWT, UserController.secret); // updated
router.route('/author').post(UserController.author);
router.route('/posts').post(UserController.influence);
router.route('/commentlist').post(UserController.commentList);
router.route('/sencomments').post(UserController.sentenceComments);
router.route('/navposts').post(UserController.navpost); // updated
router.route('/navauthors').post(UserController.navauthor); // updated
router.route('/navproposals').post(UserController.navproposal); // updated
router.route('/category').post(UserController.category);
router.route('/catsearch').post(UserController.catSearch);
router.route('/comresponses').post(UserController.comResponses);
router.route('/catlist').post(UserController.catList);  // get top 10 categories
router.route('/sublist').post(UserController.subList);  // get subcategories
router.route('/url').post(UserController.post);
router.route('/geturls').post(UserController.getUrls);  // get URL reviews
router.post('/submitprop', passportJWT, UserController.submitProp); // submit proposal
router.post('/review', passportJWT, UserController.review); // updated
router.post('/propbid', passportJWT, UserController.propBid); // proposal bid
router.post('/propreply', passportJWT, UserController.propReply); // proposal reply
router.post('/postreply', passportJWT, UserController.postReply); // updated
router.post('/catrank', passportJWT, UserController.catRank); // updated
router.post('/range', passportJWT, UserController.range);
router.post('/navcategories', passportJWT, UserController.navCategory); // get cat search results
router.post('/userdata', passportJWT, UserController.userData); // updated
router.post('/read', passportJWT, UserController.readComments);

module.exports = router;

