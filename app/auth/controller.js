import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../user/model.js';
import config from '../config.js';
import getToken from '../utils/get-token.js';

export const register = async (req, res, next) => {
    try {
        const payload = req.body; 
        let user = new User(payload);
        await user.save(); 
        return res.json(user);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.status(422).json({
                message: err.message, 
                fields: err.errors
            });
        }
        return next(err);
    }
}

export const localStrategy = async (email, password, done) => {
    try{
        let user = await User
            .findOne({email})
            .select('-__v -createdAt -updatedAt -cart_items -token');

        if (!user) return done();

        if (bcrypt.compareSync(password, user.password)) {
            const {password, ...userWithoutPassword} = user.toJSON();
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null);
    }
}

export const login = async (req, res, next) => {
    passport.authenticate('local', async (err, user) => {
        if (err) return next(err); 

        if (!user) {
            return res.status(422).json({
                message: 'User or password is incorrect.', 
                fields: null
            });      
        }

        let signed = jwt.sign(user, config.jwtSecret);
        await User.findOneAndUpdate({_id: user._id}, {$push: {token: signed}}, {new: true});
        return res.json({
            message: 'logged in successfully', 
            user: user, 
            token: signed
        });
    })(req, res, next);
}

export const me = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: 'Unauthenticated.', 
            fields: null
        });      
    }
    return res.json(req.user);
}

export const logout = async (req, res, next) => {
    let token = getToken(req);
    let user = await User.findOneAndUpdate({token: {$in: [token]}}, {$pull: {token}}, {useFindAndModify: false});
    if (!user || !token) {
        return res.status(422).json({
            message: 'Invalid user session.', 
            fields: null
        });
    }
    return res.json({
        message: 'Logout successfully'
    });
}