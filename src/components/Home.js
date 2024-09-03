import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import logo from '../assets/logo-removebg.png';

function Home() {
    const algorithmNames = [
        "BubbleSort", "CocktailSort", "QuickSort", "CombSort",
        "InsertionSort", "ShellSort", "GnomeSort", "BitonicSort",
        "SelectionSort", "HeapSort","MergeSort", "TimSort",
        "CycleSort", "OddEvenSort", "RadixSort", "BogoSort"
    ];    

    return (
        <div className="h-full max-w-7xl mx-auto flex flex-col justify-center items-center w-full p-4 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-14 sm:mt-20 md:mt-24 w-full">
                {algorithmNames.map((name, i) => (
                    <Link key={i} to={`/${name}`} className="block">
                        <Card className="bg-card hover:bg-primary/10 transition-colors duration-200 transform hover:scale-105 hover:shadow-lg">
                            <CardHeader className="flex flex-col items-center">
                                <img src={logo} alt="Algorithm Logo" className="w-20 sm:w-24 md:w-28 p-2 md:p-4 hidden sm:block" />
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardTitle className="text-card-foreground text-xl sm:text-2xl lg:text-3xl">
                                    {name}
                                </CardTitle>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home;