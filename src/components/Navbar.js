import React, { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-removebg.png';

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check if page is scrolled more than 10 pixels
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`fixed w-full bg-customBlue p-3 z-10 transition duration-500 ${isScrolled ? 'shadow-xl' : ''}`}>
            <Link to="/">
                <div className='flex justify-center items-center text-md sm:text-2xl gap-1'>
                    <h1>Algorithm</h1>
                    <img src={logo} className='w-6 sm:w-10' alt="Logo" />
                    <h1>Visualizer</h1>
                </div>
            </Link>
            <div className="absolute top-1 right-2 p-1 text-4xl sm:text-5xl hover:text-customOffWhite">
                <a href="https://github.com/BradT615/Algorithm-Visualizer" target="_blank" rel="noopener noreferrer">
                    <FaGithub/>
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
