'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditExerciseFormProps {
  id: string;
  exerciseName: string;
  numOfSets: number;
  numOfReps: number;
  weightUsed: string;
  restTime: string;
  notes: string;
}

const EditExerciseForm: React.FC<EditExerciseFormProps> = ({
  id,
  exerciseName,
  numOfSets,
  numOfReps,
  weightUsed,
  restTime,
  notes,
}) => {
  const [newExerciseName, setNewExercise] = useState(exerciseName);
  const [newNumOfSets, setNewNumOfSets] = useState(numOfSets);
  const [newNumOfReps, setNewNumOfReps] = useState(numOfReps);
  const [newWeightUsed, setNewWeightUsed] = useState(weightUsed);
  const [newRestTime, setNewRestTime] = useState(restTime);
  const [newNotes, setNewNotes] = useState(notes);

  const updatedExercise = {
    id,
    exerciseName: newExerciseName,
    numOfSets: Number(newNumOfSets), // Ensure it's a number
    numOfReps: Number(newNumOfReps), // Ensure it's a number
    weightUsed: newWeightUsed,
    restTime: newRestTime,
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
          newNumOfSets,
          newNumOfReps,
          newWeightUsed,
          newRestTime,
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
      <div>Edit Exercise</div>
      <form onSubmit={handleSubmit} className='max-w-xs mx-auto'>
        <input
          onChange={(e) => setNewExercise(e.target.value)}
          value={newExerciseName}
          type='text'
          placeholder='Exercise Name'
          className='input mb-6'
        />
        <input
          onChange={(e) => setNewNumOfSets(e.target.valueAsNumber)}
          value={newNumOfSets}
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
          onChange={(e) => setNewRestTime(e.target.value)}
          value={newRestTime}
          type='text'
          placeholder='Rest Time'
          className='input mb-6'
        />
        <input
          onChange={(e) => setNewNotes(e.target.value)}
          value={newNotes}
          type='text'
          placeholder='Notes'
          className='input mb-6'
        />
        <button className='btn btn-primary'>Update Exercise</button>
      </form>
    </>
  );
};

export default EditExerciseForm;
