import React, { useState } from 'react';
import logo from '../assets/logo-removebg.png';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex bg-neutral-500 text-white p-5">
            {/* Hamburger button */}
            <button 
                className="sm:hidden block" 
                onClick={() => setIsOpen(!isOpen)}>
                🍔
            </button>
            
            {/* Links */}
            <div className={`flex-shrink-0 border-2 gap-4 ${isOpen ? 'flex' : 'hidden'} sm:flex w-1/3`}>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </div>

            {/* Middle div */}
            <div className='flex flex-grow justify-center items-center gap-1 w-full sm:w-1/3 border-2'>
                <h1>Algorithm</h1>
                <img src={logo} className='w-10' alt="Logo" />
                <h1>Visualizer</h1>
            </div>

            {/* Right div */}
            <div className="flex-shrink-0 border-2 hidden sm:block sm:w-1/3">
                <p className='text-right'>Github</p>
            </div>
        </nav>
    );
}

export default Navbar;
