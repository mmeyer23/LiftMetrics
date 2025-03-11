'use client';

import React, { useEffect, useState } from 'react';
import RemoveBtn from './RemoveBtn';
import Link from 'next/link';
import { HiPencilAlt } from 'react-icons/hi';

// Define the type for exercises
type Exercise = {
  _id: string;
  exerciseName: string;
  numOfSets: number;
  numOfReps: number;
  weightUsed: number;
  restTime: number;
  notes: string;
};

const getExercises = async (): Promise<Exercise[]> => {
  try {
    const res = await fetch('http://localhost:3000/api/exercises', {
      method: 'GET',
      credentials: 'include',
    });

    // For debugging
    console.log('Response Status:', res.status);

    if (!res.ok) {
      throw new Error(`Failed to fetch exercises, Status: ${res.status}`);
    }
    const data = await res.json();
    console.log('Fetched Exercises:', data);
    return data.exercises || [];
  } catch (error) {
    console.log('Error loading exercises', error);
    throw error;
  }
};

export default function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]); // State with type Exercise[]
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true); // Set loading state before the fetch request
        const fetchedExercises = await getExercises(); // Get exercises
        setExercises(fetchedExercises); // Set exercises in state
      } catch (err) {
        setError('Failed to load exercises'); // Set error state if an error occurs
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchExercises(); // Call fetchExercises when component mounts
  }, []); // Empty dependency array means this effect will run once on mount

  // If loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, show an error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {exercises.map((e) => (
        <div
          className='p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start'
          key={e._id}
        >
          <div>
            <h2 className='font-bold text-3xl mb-2'>{e.exerciseName}</h2>
            <h2 className='font-bold'>{e.numOfSets} Sets</h2>
            <h2 className='font-bold'>{e.numOfReps} Reps</h2>
            <h2 className='font-bold'>Weight Used: {e.weightUsed}</h2>
            <h2 className='font-bold'> Rest Time: {e.restTime}</h2>
            <h2 className='font-bold'>Notes: {e.notes}</h2>
          </div>
          <div className='flex gap-2'>
            <RemoveBtn id={e._id} />
            <Link href={`/edit-exercise/${e._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
