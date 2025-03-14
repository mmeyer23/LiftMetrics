'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditExerciseFormProps } from '../../../types/exerciseTypes';

const EditExerciseForm: React.FC<EditExerciseFormProps> = ({
  id,
  exerciseName,
  numOfReps,
  weightUsed,
  date,
  notes,
}) => {
  const [newExerciseName, setNewExercise] = useState<string>(exerciseName);
  const [newNumOfReps, setNewNumOfReps] = useState<number>(numOfReps);
  const [newWeightUsed, setNewWeightUsed] = useState<string>(weightUsed);
  const [newDate, setNewDate] = useState<string>(date);
  const [newNotes, setNewNotes] = useState<string>(notes);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/exercises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          newExerciseName,
          newNumOfReps,
          newWeightUsed,
          newDate,
          newNotes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update exercise');
      }
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>Edit Personal Record (PR)</div>
      <form onSubmit={handleSubmit} className='max-w-xs mx-auto'>
        <input
          onChange={(e) => setNewExercise(e.target.value)}
          value={newExerciseName}
          type='text'
          placeholder='Exercise Name'
          className='input mb-6'
        />
        <input
          onChange={(e) => setNewNumOfReps(e.target.valueAsNumber)}
          value={newNumOfReps}
          type='number'
          className='input validator'
          required
          placeholder='Number of Repetitions'
          min={1}
          max={200}
          title='Must be between be 1 to 200'
        />
        <p className='validator-hint'>Must be a number</p>
        <input
          onChange={(e) => setNewWeightUsed(e.target.value)}
          value={newWeightUsed}
          type='text'
          placeholder='Weight Used'
          className='input mb-6'
        />
        <input
          onChange={(e) => setNewDate(e.target.value)}
          value={newDate}
          type='date'
          className='input mb-6'
        />
        <input
          onChange={(e) => setNewNotes(e.target.value)}
          value={newNotes}
          type='text'
          placeholder='Notes'
          className='input mb-6'
        />
        <button
          className='btn bg-blue-400 text-white 
                        hover:bg-blue-600 hover:scale-105 transition-all duration-200
                        active:scale-95 active:bg-blue-700'
        >
          Update PR
        </button>
      </form>
    </>
  );
};

export default EditExerciseForm;
