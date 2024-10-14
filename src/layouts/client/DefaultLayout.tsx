import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return <div>
        <Navbar />
        {children}
        <Footer />
    </div>
}