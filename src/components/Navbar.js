import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import logo from '../assets/Logo.png';

function NavbarComponent() {
    return (
        <nav className="fixed w-full flex justify-between items-center">
            <Link to="/" className='flex items-center'>
                <img src={logo} className="w-16 sm:w-24" alt="Logo" />
                <h1 className="text-lg sm:text-3xl font-semibold">Algorithm Visualizer</h1>
            </Link>
            <button className="p-4 rounded-full transition-all duration-200 ease-in-out hover:bg-primary/10 hover:scale-110 hover:opacity-80">
                <Link to="https://github.com/BradT615/Algorithm-Visualizer" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="h-8 w-8 sm:h-12 sm:w-12" />
                </Link>
            </button>
        </nav>
    );
}

export default NavbarComponent;