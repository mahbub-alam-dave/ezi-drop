import Footer from '@/components/sharedComponents/footer/Footer';
import Navbar from '@/components/sharedComponents/navbar/Navbar';
import NextAuthProvider from '@/providers/NextAuthProvider';
import React from 'react';

const MainLayout = ({children}) => {
    return (
        <div className="bg-gray-50 dark:bg-black text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
        <NextAuthProvider>
            <Navbar />
            <div className='pt-[100px]'>
                {children}
            </div>
            <Footer />
        </NextAuthProvider>
        </div>
    );
};

export default MainLayout;