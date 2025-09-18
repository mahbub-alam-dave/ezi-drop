"use client"
import Link from 'next/link';
import React from 'react';

const Sidebar = ({navLinks, status}) => {
    return (
        <div className='w-[300px] h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg)]'>
            <div className='flex flex-col items-start gap-6 p-8'>
           <nav>
            <ul className="flex flex-col  gap-8 ">
              {navLinks}
            </ul>
          </nav>
      <div className='flex sm:hidden gap-4'>
      {
        status === "authenticated" ?
        <button onClick={() => signOut()} className="btn bg-[var(--color-secondary)] dark:bg-[var(--color-secondary-dark)] rounded-sm text-white border-none">Logout</button>
       :
      <Link href={'/login'}><button className=" btn bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] rounded-sm text-white border-none">Login</button></Link>
      }
    </div> 
          </div>
        </div>
    );
};

export default Sidebar;