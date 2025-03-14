'use client';

import React, { useState, useEffect } from 'react';
import EditExerciseForm from '../../components/forms/EditExerciseForm';
import { ExerciseResponse, GetExerciseResponse } from '../../../types/exerciseTypes';


const getExerciseById = async (id: string): Promise<ExerciseResponse | null> => {
  try {
    const res = await fetch(`http://localhost:3000/api/exercises/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch exercise');
    }
    const data: GetExerciseResponse = await res.json();
    console.log('EXERCISE DATA:', JSON.stringify(data, null, 2));

    return data.exercise || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const EditExercise: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const [exercise, setExercise] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = React.use(params);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const data = await getExerciseById(id); 
        console.log('DATA:' + data); 
        if (data) {
          setExercise(data);
        } else {
          setError('Failed to load exercise data');
        }
      } catch (err) {
        setError('An error occurred while fetching exercise data');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!exercise) {
    return <div>No exercise data available.</div>;
  }


  const { exerciseName, numOfReps, weightUsed, date, notes } = exercise;

  console.log(JSON.stringify(exercise, null, 2));

  return (
    <EditExerciseForm
      id={id} 
      exerciseName={exerciseName}
      numOfReps={numOfReps}
      weightUsed={weightUsed}
      date={date}
      notes={notes}
    />
  );
};

export default EditExercise;
