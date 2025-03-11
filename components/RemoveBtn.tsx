'use client';

import React from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

// Define the type for the props
type RemoveBtnProps = {
  id: string; // Expecting `id` of type string
};

export default function RemoveBtn({ id }: RemoveBtnProps) {
  const router = useRouter();
  const removeTopic = async () => {
    const confirmed = confirm('Are you sure?');

    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/exercises?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Make sure the content type is application/json
        },
        body: JSON.stringify({ exerciseId: id }), // Sending the ID as JSON
      });
      if (res.ok) {
        window.location.reload();
      }
    }
  };
  return (
    <button onClick={removeTopic} className='text-red-400'>
      <HiOutlineTrash size={24} />
    </button>
  );
}
