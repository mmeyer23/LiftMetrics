'use client';

import React from 'react';
import { useActionState } from 'react';
import { register } from '../actions/userController';

export default function RegisterForm() {
  const [formState, formAction] = useActionState(register, {});

  return (
    <form action={formAction} className='max-w-xs mx-auto'>
      <div className='mb-3'>
        <label className='input validator'>
          <svg
            className='h-[1em] opacity-50'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
          >
            <g
              strokeLinejoin='round'
              strokeLinecap='round'
              strokeWidth='2.5'
              fill='none'
              stroke='currentColor'
            >
              <rect width='20' height='16' x='2' y='4' rx='2'></rect>
              <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
            </g>
          </svg>
          <input
            autoComplete='off'
            name='email'
            type='email'
            placeholder='Email'
            required
          />
        </label>

        {/* Display error for email if it exists */}
        {formState.errors?.email && (
          <div className='text-red-600 mt-2'>{formState.errors.email}</div>
        )}

        <div className='validator-hint hidden'>Enter valid email address</div>
      </div>
      <div className='mb-3'>
        <label className='input validator'>
          <svg
            className='h-[1em] opacity-50'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
          >
            <g
              strokeLinejoin='round'
              strokeLinecap='round'
              strokeWidth='2.5'
              fill='none'
              stroke='currentColor'
            >
              <path d='M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'></path>
              <circle cx='16.5' cy='7.5' r='.5' fill='currentColor'></circle>
            </g>
          </svg>
          <input
            name='password'
            type='password'
            required
            placeholder='Password'
            minLength={8}
            pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
            title='Must be more than 8 characters, including number, lowercase letter, uppercase letter'
          />
        </label>
        <p className='validator-hint hidden'>
          Must be more than 8 characters, including
          <br />
          At least one number
          <br />
          At least one lowercase letter
          <br />
          At least one uppercase letter
        </p>
      </div>
      <button className='btn btn-primary'>Create Account</button>
      {/* Display any general form errors */}
      {formState.errors?.form && (
        <div className='text-red-600 mt-3'>{formState.errors.form}</div>
      )}
    </form>
  );
}
