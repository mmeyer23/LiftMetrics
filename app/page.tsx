import RegisterForm from '../components/RegisterForm';
import { getUserFromCookie } from '../lib/getUser';
import React from 'react';

export default async function Page() {
  const user = await getUserFromCookie();

  return (
    <>
      {user ? (
        <p>Welcome, you are logged in!</p>
      ) : (
        <>
          <p className='text-center text-2xl text-gray-600 mb-5'>
            Don't have an account? <strong>Create One</strong>
          </p>
          <RegisterForm />
        </>
      )}
    </>
  );
}
