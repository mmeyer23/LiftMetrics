import React from 'react';
import RegisterForm from './components/forms/RegisterForm';
import { getUserFromCookie } from '../server/utils/getUser';
import ExerciseList from './components/exercises/ExerciseList';

export default async function Page() {
  const user = await getUserFromCookie();

  return (
    <>
      {user ? (
        <>
          <p>Welcome, you are logged in!</p>
          <p>Here are your saved PRs:</p>
          <ExerciseList />
        </>
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
