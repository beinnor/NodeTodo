import jwt from 'express-jwt';
import config from '../config.mjs';
import { db } from '../_helpers/db.mjs';

const { jwt_secret } = config;

function authorize() {    
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret: jwt_secret, algorithms: ['HS256'] }),

        // attach full user record to request object
        async (req, res, next) => {
            // get user with id from token 'sub' (subject) property
            const user = await db.User.findByPk(req.user.sub);

            // check user still exists
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}

export { authorize };