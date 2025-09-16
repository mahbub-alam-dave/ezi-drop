import React from 'react';

const Sidebar = ({navLinks}) => {
    return (
        <div className='w-[300px]  h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg)]'>
            <div className='flex flex-col items-start gap-6 p-8'>
           <nav>
            <ul className="flex flex-col  gap-8 ">
              {navLinks}
            </ul>
          </nav>
          <button className="sm:hidden btn bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] rounded-sm text-white border-none">
            Login
          </button> 
          </div>
        </div>
    );
};

export default Sidebar;