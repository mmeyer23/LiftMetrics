'use client';

import React, { useState, useEffect } from 'react';
import EditExerciseForm from '../../../components/EditExerciseForm';

// Function to fetch the exercise data by ID
const getExerciseById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/exercises/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch exercise');
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default function EditExercise({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [exercise, setExercise] = useState<any>(null); // Default to null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params using React.use() before accessing id
  const { id } = React.use(params);

  // Fetch exercise data when the component mounts
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const data = await getExerciseById(id); // Directly access `id`
        console.log('DATA:' + data); // Log raw response data
        if (data && data.exercise) {
          setExercise(data.exercise);
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
  }, [id]); // Depend on `id` to refetch if it changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!exercise) {
    return <div>No exercise data available.</div>;
  }

  // Destructure the data from the response
  const { exerciseName, numOfReps, weightUsed, date, notes } = exercise;

  console.log(JSON.stringify(exercise, null, 2));

  return (
    <EditExerciseForm
      id={id} // Pass the id
      exerciseName={exerciseName}
      numOfReps={numOfReps}
      weightUsed={weightUsed}
      date={date}
      notes={notes}
    />
  );
}
