import express from 'express';
import multer from 'multer';
import * as authController from './controller.js';
import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;
const router = express.Router();

passport.use(new LocalStrategy({usernameField: 'email'}, authController.localStrategy));

router.post('/register', multer().none(), authController.register);
router.post('/login', multer().none(), authController.login);
router.get('/me', multer().none(), authController.me);
router.post('/logout', multer().none(), authController.logout);

export default router;