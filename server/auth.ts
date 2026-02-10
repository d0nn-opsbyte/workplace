const bcrypt = require('bcrypt');
const { db } = require('./db.js');

export interface AuthUser {
  id: number;
  email: string;
  user_type: 'job_seeker' | 'employer';
  full_name: string;
}

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function registerUser(
  email: string,
  password: string,
  full_name: string,
  user_type: 'job_seeker' | 'employer',
  additionalData?: { company_name?: string }
): Promise<AuthUser> {
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
  } else if (user_type === 'employer') {
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

async function loginUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();

  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    user_type: user.user_type,
    full_name: user.full_name
  };
}

async function getUserById(userId: number): Promise<AuthUser | null> {
  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', userId)
    .executeTakeFirst();

  if (!user) return null;

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
