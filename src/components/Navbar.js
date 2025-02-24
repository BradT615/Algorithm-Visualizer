import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { Button } from "../components/ui/button";
import Logo from './Logo';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from "./theme-provider";
import { Switch } from "../components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";


function NavbarComponent() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme, setTheme } = useTheme();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 bg-background/80 backdrop-blur-xl shadow-sm' : 'py-4 bg-background/0'}`}>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo and brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <Logo className="w-10 sm:w-11" />
                        <span className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Algorithm Visualizer
                        </span>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex gap-3 items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleDarkMode}
                                className="text-foreground"
                            >
                                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </Button>
                            <Button
                                variant="outline"
                                size="default"
                                asChild
                                className="gap-2 border-primary/20 hover:border-primary"
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
                    </div>

                    {/* Mobile menu dropdown */}
                    <div className="md:hidden">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                                <DropdownMenuItem className="flex justify-between items-center cursor-pointer" onClick={toggleDarkMode}>
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        <span>Dark mode</span>
                                    </div>
                                    <Switch 
                                        checked={theme === 'dark'} 
                                        onCheckedChange={toggleDarkMode}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link 
                                        to="https://github.com/BradT615/Algorithm-Visualizer" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex gap-2 w-full"
                                    >
                                        <FaGithub className="w-4 h-4" />
                                        GitHub
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavbarComponent;