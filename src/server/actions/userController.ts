'use server';

import { getCollection } from '../utils/db';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { RegistrationResponse } from 'types/formTypes';

export const login = async (
  prevState: any,
  formData: FormData
): Promise<RegistrationResponse> => {
  const errors: Record<string, string> = {};

  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;


  if (!email || !password) {
    errors.form = 'Both email and password are required!';
    return { errors };
  }

  const collection = await getCollection('users');
  const user = await collection.findOne({ email });
  if (!user) {
    errors.form = 'Account with this email does not exist.';
    return { errors };
  }

  const verified = bcrypt.compareSync(password, user.password);

  if (!verified) {
    errors.form = 'Invalid username or password';
    return { errors };
  }

 
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
    sameSite: 'lax',
    maxAge: 1800,
    secure: false,
    path: '/',
  });
  return redirect('/');
};

export const logout = async function (): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('liftmetrics');
  redirect('/');
};

export const register = async (
  prevState: any,
  formData: FormData
): Promise<RegistrationResponse> => {
  const errors: Record<string, string> = {};

  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  if (!email || !password) {
    errors['form'] = 'Email and password do not match!';
    return { errors };
  }

  const usersCollection = await getCollection('users');
  const possibleEmail = await usersCollection.findOne({ email: email });

  if (possibleEmail) {
    errors.email = 'That email is already in use';
    return { errors };
  }


  try {
    const hashedPassword = await bcrypt.hash(password as string, 10);

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
      sameSite: 'lax',
      maxAge: 1800,
      secure: false,
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
