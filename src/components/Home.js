import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const algorithmNames = [
        "BubbleSort", "CocktailSort", "QuickSort", "CombSort",
        "InsertionSort", "ShellSort", "GnomeSort", "PatienceSort",
        "SelectionSort", "HeapSort","MergeSort", "TimSort",
        "CycleSort", "BucketSort", "RadixSort", "BogoSort"
    ];

    const getImagePath = (algorithmName) => {
        try {
            // Dynamically import the image based on the algorithm name
            return require(`../assets/sortImages/${algorithmName}.png`);
        } catch (error) {
            console.error('Image not found for algorithm:', algorithmName);
            // Fallback image or handle error as required
            return null;
        }
    };

    return (
        <div className="h-full max-w-7xl m-auto flex flex-col justify-center items-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 p-10">
                {algorithmNames.map((name, i) => (
                    <Link key={i} to={`/${name}`}>
                        <div className="bg-customBlue text-customOffWhite text-2xl p-4 flex flex-col items-center rounded-3xl w-full transform hover:scale-105 transition-transform">
                            <img src={getImagePath(name)} alt={`${name} Algorithm`} className="rounded-full bg-transparent p-6" />
                            {name}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home;
