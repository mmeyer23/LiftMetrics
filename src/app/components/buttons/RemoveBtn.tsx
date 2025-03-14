'use client';

import React from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { RemoveBtnProps } from '../../../types/RemoveBtnTypes';

export default function RemoveBtn({ id }: RemoveBtnProps) {
  const removeTopic = async () => {
    const confirmed = confirm('Are you sure?');

    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/exercises?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseId: id }),
      });
      if (res.ok) {
        window.location.reload();
      }
    }
  };
  return (
    <button
      onClick={removeTopic}
      className='text-red-400 hover:text-red-600 hover:scale-110 transition-all duration-100 cursor-pointer'
    >
      <HiOutlineTrash size={24} />
    </button>
  );
}
