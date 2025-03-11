'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddExercise() {
  const [exerciseName, setExerciseName] = useState('');
  const [numOfReps, setNumOfReps] = useState('');
  const [numOfSets, setNumOfSets] = useState('');
  const [weightUsed, setWeightUsed] = useState('');
  const [restTime, setRestTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Optional: For loading state
  const [error, setError] = useState<string | null>(null); // Optional: For error state

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!exerciseName || !numOfReps || !numOfSets || !weightUsed || !restTime) {
      alert('Values for all fields, except Notes, are required!');
      return;
    }

    setIsLoading(true); // Show loading state

    try {
      const res = await fetch('http://localhost:3000/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseName,
          numOfSets,
          numOfReps,
          weightUsed,
          restTime,
          notes,
        }),
      });

      if (res.ok) {
        // Redirect to the homepage if successful
        router.push('/');
      } else {
        // Handle the error from the backend
        throw new Error('Failed to create a new exercise log');
      }
    } catch (error) {
      console.error(error);
      setError('There was an error adding the exercise. Please try again.'); // Show error message
    } finally {
      setIsLoading(false); // Hide loading state after the fetch completes
    }
  };

  return (
    <>
      <h2 className='text-center text-2xl text-gray-600 mb-5'>
        Add Exercise Info Below
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
          onChange={(e) => setNumOfSets(e.target.value)}
          value={numOfSets}
          type='number'
          className='input validator'
          required
          placeholder='Number of Sets'
          min='1'
          max='20'
          title='Must be between be 1 to 20'
        />
        <p className='validator-hint'>Must be a number</p>
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
          onChange={(e) => setRestTime(e.target.value)}
          value={restTime}
          type='text'
          placeholder='Rest Time'
          className='input mb-6'
        />
        <input
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
          type='text'
          placeholder='Notes'
          className='input mb-6'
        />
        <button type='submit' className='btn btn-primary' disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Exercise'}
        </button>
      </form>
    </>
  );
}
