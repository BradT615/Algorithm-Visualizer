import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardTitle } from './ui/card';

function Home() {
    const algorithmNames = [
        "BubbleSort", "CocktailSort", "QuickSort", "CombSort",
        "InsertionSort", "ShellSort", "GnomeSort", "BitonicSort",
        "SelectionSort", "HeapSort", "MergeSort", "TimSort",
        "CycleSort", "OddEvenSort", "RadixSort", "BogoSort"
    ];    

    return (
        <div className="min-h-screen max-w-3xl mx-auto w-full p-4 py-8">

            <div className="flex flex-col gap-4 mt-24">
                {algorithmNames.map((name, i) => (
                    <Link key={i} to={`/${name}`}>
                        <Card className="bg-card hover:bg-primary/10 transition-colors duration-200">
                            <CardContent className="p-6">
                                <CardTitle className="text-card-foreground text-xl text-center">
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