'use server';

import { getCollection } from '../lib/db';
import bcrypt from 'bcrypt';

interface RegistrationResponse {
  success?: boolean;
  errors?: Record<string, string>;
}

export const register = async (
  prevState,
  formData
): Promise<RegistrationResponse> => {
  const errors = {};

  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    errors['form'] = 'Email and password are required';
    return { errors };
  }

  // hash password

  const hashedPassword = await bcrypt.hash(password, 10);

  const ourUser = {
    email,
    password: hashedPassword,
  };

  // store a new user in the database

  const usersCollection = await getCollection('users');
  await usersCollection.insertOne(ourUser);

  // log the user in by giving them a cookie

  return {
    success: true,
  };
};
