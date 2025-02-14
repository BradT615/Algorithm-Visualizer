import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from './theme-toggle';
import { FaGithub } from 'react-icons/fa';
import { Button } from "../components/ui/button";
import Logo from './Logo';

function NavbarComponent() {
    return (
        <nav className="fixed w-full flex justify-between items-center bg-muted z-10 px-2 sm:px-4 h-20 shadow-sm">
            <Link to="/" className="flex items-center gap-1 sm:gap-4">
                <Logo className="w-10 sm:w-12" />
                <h1 className="text-lg sm:text-2xl font-semibold">Algorithm Visualizer</h1>
            </Link>
            <div className="flex items-center gap-2 sm:gap-6">
                <ModeToggle />
                <Button
                    variant="outline"
                    size="default"
                    asChild
                    className="gap-2"
                >
                    <Link 
                        to="https://github.com/BradT615/Algorithm-Visualizer" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaGithub className="w-4 h-4" />
                        GitHub
                    </Link>
                </Button>
            </div>
        </nav>
    );
}

export default NavbarComponent;