"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const { db } = require('./db.js');
const SALT_ROUNDS = 10;
async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
async function registerUser(email, password, full_name, user_type, additionalData) {
    const hashedPassword = await hashPassword(password);
    const user = await db
        .insertInto('users')
        .values({
        email,
        password: hashedPassword,
        full_name,
        user_type
    })
        .returningAll()
        .executeTakeFirstOrThrow();
    // Create related profile based on user type
    if (user_type === 'job_seeker') {
        await db
            .insertInto('job_seekers')
            .values({ user_id: user.id })
            .execute();
    }
    else if (user_type === 'employer') {
        await db
            .insertInto('employers')
            .values({
            user_id: user.id,
            company_name: additionalData?.company_name || ''
        })
            .execute();
    }
    return {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        full_name: user.full_name
    };
}
async function loginUser(email, password) {
    const user = await db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();
    if (!user)
        return null;
    const isValid = await verifyPassword(password, user.password);
    if (!isValid)
        return null;
    return {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        full_name: user.full_name
    };
}
async function getUserById(userId) {
    const user = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
    if (!user)
        return null;
    return {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        full_name: user.full_name
    };
}
module.exports = {
    hashPassword,
    verifyPassword,
    registerUser,
    loginUser,
    getUserById
};
//# sourceMappingURL=auth.js.map