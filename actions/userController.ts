'use server';

import { getCollection } from '../lib/db';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

interface RegistrationResponse {
  success?: boolean;
  errors?: Record<string, string>;
}

export const login = async function (prevState, formData) {
  const error = {
    success: false,
    message: 'Invalid username or password',
  };

  const ourUser = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const collection = await getCollection('users');
  const user = await collection.findOne({ email: ourUser.email });
  if (!user) {
    return error;
  }

  const verified = bcrypt.compareSync(ourUser.password, user.password);

  if (!verified) {
    return error;
  }

  //create jwt value
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not defined in environent variables');
  }

  const ourTokenValue = jwt.sign(
    { userId: user._id, exp: Math.floor(Date.now() / 1000) + 1800 },
    jwtSecret
  );
  const cookieStore = await cookies();
  cookieStore.set('liftmetrics', ourTokenValue, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1800,
    secure: true,
  });
  return redirect('/');
};

export const logout = async function () {
  const cookieStore = await cookies();
  cookieStore.delete('liftmetrics');
  redirect('/');
};

export const register = async (
  prevState,
  formData
): Promise<RegistrationResponse> => {
  const errors: Record<string, string> = {};

  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    errors['form'] = 'Email and password are required';
    return { errors };
  }

  const usersCollection = await getCollection('users');
  const possibleEmail = await usersCollection.findOne({ email: email });

  if (possibleEmail) {
    errors.email = 'That email is already in use';
  }

  // hash password
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const ourUser = {
      email,
      password: hashedPassword,
    };
    const usersCollection = await getCollection('users');
    const newUser = await usersCollection.insertOne(ourUser);
    const userId = newUser.insertedId.toString();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not defined in environent variables');
    }

    const ourTokenValue = jwt.sign(
      { userId: userId, exp: Math.floor(Date.now() / 1000) + 1800 },
      jwtSecret
    );
    const cookieStore = await cookies();
    cookieStore.set('liftmetrics', ourTokenValue, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1800,
      secure: true,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error during registration', error);
    errors['form'] = 'Something went wrong, please try again!';
    return { errors };
  }
};
