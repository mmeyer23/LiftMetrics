import React from 'react';
import Link from 'next/link';
import { getUserFromCookie } from '../../../server/utils/getUser';
import { logout } from '../../../server/actions/userController';
import { User } from '../../../types/userTypes';

export default async function Header() {
  const user: User | null = await getUserFromCookie();

  return (
    <header className='bg-gray-100 shadow-md'>
      <div className='container mx-auto'>
        <div className='navbar'>
          <div className='flex-1'>
            <Link href='/' className='btn btn-ghost text-xl'>
              LiftMetrics
            </Link>
          </div>
          <div className='flex-none'>
            <ul className='menu menu-horizontal px-1'>
              {user ? (
                <>
                  <li className='mr-3'>
                    <Link
                      href='/new-exercise'
                      className='btn bg-blue-400 text-white 
                        hover:bg-blue-600 hover:scale-105 transition-all duration-200
                        active:scale-95 active:bg-blue-700'
                    >
                      Add Personal Record (PR)
                    </Link>
                  </li>
                  <li>
                    <form
                      action={logout}
                      className='btn bg-gray-500 text-white 
                        hover:bg-gray-800 hover:scale-105 transition-all duration-200
                        active:scale-95 active:bg-gray-900'
                    >
                      <button>Log Out</button>
                    </form>
                  </li>
                </>
              ) : (
                <li>
                  <Link href='/login'>Log In</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
