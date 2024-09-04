import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { Navbar, NavbarContent } from "./ui/navbar";
import logo from '../assets/logo-removebg.png';

function NavbarComponent() {
    return (
        <Navbar className="w-full">
            <NavbarContent className="flex justify-between w-full">
                <Link to="/" className="flex items-center space-x-2 text-lg sm:text-2xl">
                    <img src={logo} className="w-8 sm:w-12" alt="Logo" />
                    <span>Algorithm</span>
                    <span>Visualizer</span>
                </Link>
                <button className="p-2 rounded-full transition-all duration-200 ease-in-out hover:bg-primary/10 hover:scale-110 hover:opacity-80">
                    <a href="https://github.com/BradT615/Algorithm-Visualizer" target="_blank" rel="noopener noreferrer">
                        <FaGithub className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="sr-only">GitHub</span>
                    </a>
                </button>
            </NavbarContent>
        </Navbar>
    );
}

export default NavbarComponent;