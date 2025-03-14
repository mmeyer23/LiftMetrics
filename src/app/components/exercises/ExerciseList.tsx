'use client';

import React, { useEffect, useState } from 'react';
import RemoveBtn from '../buttons/RemoveBtn';
import Link from 'next/link';
import { HiPencilAlt } from 'react-icons/hi';
import { Exercise, GetExerciseResponse } from '../../../types/exerciseTypes';

const getExercises = async (): Promise<Exercise[]> => {
  try {
    const res = await fetch('http://localhost:3000/api/exercises', {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch exercises, Status: ${res.status}`);
    }
    const data: GetExerciseResponse = await res.json();
    console.log('Fetched Exercises:', data);
    return data.exercises || [];
  } catch (error) {
    console.log('Error loading exercises', error);
    throw error;
  }
};

const ExerciseList: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const fetchedExercises = await getExercises();
        setExercises(fetchedExercises);
      } catch (err) {
        setError('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <h2>
              <span className='font-bold'>Reps: </span>
              {e.numOfReps}
            </h2>
            <h2>
              <span className='font-bold'>Weight Used:</span> {e.weightUsed}
            </h2>
            <h2>
              <span className='font-bold'>Date:</span> {e.date}
            </h2>
            <h2>
              <span className='font-bold'>Notes:</span> {e.notes}
            </h2>
          </div>
          <div className='flex gap-2'>
            <RemoveBtn id={e._id} />
            <Link href={`/edit-exercise/${e._id}`}>
              <HiPencilAlt
                size={24}
                className='text-blue-400 hover:text-blue-600 hover:scale-110 transition-all duration-100 cursor-pointer'
              />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default ExerciseList;
