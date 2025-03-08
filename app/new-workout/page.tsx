'use client';
import React from 'react';
import { useActionState } from 'react';
import { register } from '../../actions/userController'; // Make sure you import the correct action

export default function Page() {
  const initialState = {
    success: false,
    message: '',
    errors: {}, // Track both backend and frontend errors
  };

  const [formState, formAction] = useActionState(register, initialState); // Ensure this matches the action (register)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formAction(formState, formData); // Submit the form data to the backend
  };

  return (
    <>
      <h2 className='text-center text-2xl text-gray-600 mb-5'>
        Add Exercise Info Below
      </h2>
      <form onSubmit={handleSubmit} className='max-w-xs mx-auto'>
      <input type="text" placeholder="Exercise Name" className="input mb-6" />
      <input type="number" className="input validator" required placeholder="Number of Sets" 
min="1" max="10" title="Must be between be 1 to 10" />
<p className="validator-hint">Must be a number</p>
<input type="number" className="input validator" required placeholder="Number of Repetitions" 
min="1" max="10" title="Must be between be 1 to 10" />
<p className="validator-hint">Must be a number</p>
<input type="number" className="input validator" required placeholder="Weight Used" 
min="1" max="10" title="Must be between be 1 to 10" />
<p className="validator-hint">Must be a number</p>
<input type="text" placeholder="Rest Time" className="input mb-6" />
      <input type="text" placeholder="Notes" className="input mb-6" />
        <button className='btn btn-primary'>Add Exercise</button>

        {/* Display general form error if any */}
        {formState.errors?.form && (
          <div className='text-red-600 mt-3'>{formState.errors.form}</div>
        )}
      </form>
    </>
  );
}
