import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';

function Home() {
    const algorithmNames = [
        "BubbleSort", "CocktailSort", "QuickSort", "CombSort",
        "InsertionSort", "ShellSort", "GnomeSort", "BitonicSort",
        "SelectionSort", "HeapSort", "MergeSort", "TimSort",
        "CycleSort", "OddEvenSort", "RadixSort", "BogoSort"
    ];    

    // Function to add spaces before capital letters
    const formatAlgorithmName = (name) => {
        return name.replace(/([A-Z])/g, ' $1').trim();
    };

    return (
        <div className="min-h-screen w-full p-6 md:p-8">
            <div className="max-w-4xl mx-auto mt-24">
                <h1 className="text-4xl font-semibold text-center mb-12">
                    Algorithm Visualizer
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {algorithmNames.map((name, i) => (
                        <Link key={i} to={`/${name}`}>
                            <Card className="group h-32 overflow-hidden transition-all duration-300 hover:scale-105">
                                <CardContent className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-white/50 to-white/30 dark:from-black/50 dark:to-black/30 backdrop-blur-xl">
                                    <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                                        {formatAlgorithmName(name)}
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;