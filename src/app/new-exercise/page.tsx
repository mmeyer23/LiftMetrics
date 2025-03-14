'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddExercise() {
  const [exerciseName, setExerciseName] = useState('');
  const [numOfReps, setNumOfReps] = useState('');
  const [weightUsed, setWeightUsed] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!exerciseName || !numOfReps || !weightUsed || !date) {
      alert('Values for all fields, except Notes, are required!');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseName,
          numOfReps,
          weightUsed,
          date,
          notes,
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to create a new PR');
      }
    } catch (error) {
      console.error(error);
      setError('There was an error adding the PR. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className='text-center text-2xl text-gray-600 mb-5'>
        Add Personal Record (PR) Below
      </h2>
      {error && <div className='error-message'>{error}</div>}{' '}
      {/* Display error if there's any */}
      <form onSubmit={handleSubmit} className='max-w-xs mx-auto'>
        <input
          onChange={(e) => setExerciseName(e.target.value)}
          value={exerciseName}
          type='text'
          placeholder='Exercise Name'
          className='input mb-6'
        />
        <input
          onChange={(e) => setNumOfReps(e.target.value)}
          value={numOfReps}
          type='number'
          className='input validator'
          required
          placeholder='Number of Repetitions'
          min='1'
          max='200'
          title='Must be between be 1 to 200'
        />
        <p className='validator-hint'>Must be a number</p>
        <input
          onChange={(e) => setWeightUsed(e.target.value)}
          value={weightUsed}
          type='text'
          placeholder='Weight Used'
          className='input mb-6'
        />
        <input
          onChange={(e) => setDate(e.target.value)}
          value={date}
          type='date'
          className='input mb-6'
        />
        <input
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
          type='text'
          placeholder='Notes'
          className='input mb-6'
        />
        <button
          type='submit'
          className='btn bg-blue-400 text-white 
                        hover:bg-blue-600 hover:scale-105 transition-all duration-200
                        active:scale-95 active:bg-blue-700'
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add PR'}
        </button>
      </form>
    </>
  );
}
