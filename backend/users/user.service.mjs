import config from '../config.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../_helpers/db.mjs';

const userService = {};
const { sign, verify } = jwt;
const { jwt_secret } = config;

userService.authenticate = async ({ username, password }) => {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, jwt_secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

userService.getAll = async () => {
    return await db.User.findAll();
}

userService.getById = async (id) => {
    return await getUser(id);
}

userService.create = async (params) => {
    // validate
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

userService.update = async (id, params) => {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

userService._delete = async (id) => {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

userService.getUser = async (id) => {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

const omitHash = async (user) => {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}

export { userService };