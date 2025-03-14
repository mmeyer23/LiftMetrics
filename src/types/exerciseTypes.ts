export type Exercise = {
  _id: string;
  exerciseName: string;
  numOfReps: number;
  weightUsed: number;
  date: string;
  notes: string;
};

export type ExerciseResponse = {
  _id: string;
  exerciseName: string;
  numOfReps: number;
  weightUsed: number;
  date: string;
  notes: string;
  userId: string;
};

export type GetExerciseResponse = {
  exercise: ExerciseResponse | ExerciseResponse[];
};

export interface EditExerciseFormProps {
  id: string;
  exerciseName: string;
  numOfReps: number;
  weightUsed: string;
  date: string;
  notes: string;
}
