import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-removebg.png';

function Navbar() {
    return (
        <nav className="fixed w-full bg-customBlue p-3 z-10">
            <Link to="/">
                <div className='flex justify-center items-center text-2xl gap-1'>
                    <h1>Algorithm</h1>
                    <img src={logo} className='w-10' alt="Logo" />
                    <h1>Visualizer</h1>
                </div>
            </Link>
            <div className="absolute top-2 right-2 p-1 hidden sm:block transform hover:scale-105 transition-transform hover:text-customOffWhite">
                <a href="https://github.com/BradT615/Algorithm-Visualizer" target="_blank" rel="noopener noreferrer">
                    <FaGithub size={40} />
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
