import jwt from 'jsonwebtoken';
import config from '../config.js';
import getToken from '../utils/get-token.js';
import User from '../user/model.js';

export const decodeToken = async (req, res, next) => {
    try {
        let token = getToken(req);     
        if (!token) return next(); 

        req.user = jwt.verify(token, config.jwtSecret); 
        let user = await User.findOne({token: {$in: [token]}});
        if (!user) {
            return res.status(401).json({
                message: 'Unauthenticated : token expired.', 
                fields: null
            });
        }
    } catch (err) {
        if (err && err.name === 'JsonWebTokenError'){
            return res.status(422).json({
                message: err.message, 
                fields: {name: 'token'}
            });
        }
        return next(err);
    } 

    return next();
}