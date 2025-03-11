'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditExerciseFormProps {
  id: string;
  exerciseName: string;
  numOfReps: number;
  weightUsed: string;
  date: string;
  notes: string;
}

const EditExerciseForm: React.FC<EditExerciseFormProps> = ({
  id,
  exerciseName,
  numOfReps,
  weightUsed,
  date,
  notes,
}) => {
  const [newExerciseName, setNewExercise] = useState(exerciseName);
  const [newNumOfReps, setNewNumOfReps] = useState(numOfReps);
  const [newWeightUsed, setNewWeightUsed] = useState(weightUsed);
  const [newDate, setNewDate] = useState(date);
  const [newNotes, setNewNotes] = useState(notes);

  const updatedExercise = {
    id,
    exerciseName: newExerciseName,
    numOfReps: Number(newNumOfReps), // Ensure it's a number
    weightUsed: newWeightUsed,
    date: newDate,
    notes: newNotes,
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
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
          min='1'
          max='200'
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
        <button className='btn btn-primary'>Update PR</button>
      </form>
    </>
  );
};

export default EditExerciseForm;
