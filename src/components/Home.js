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
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-24 p-8 sm:p-24 md:p-10">
                {algorithmNames.map((name, i) => (
                    <Link key={i} to={`/${name}`}>
                        <div className="bg-customCyberBlue text-customOffWhite p-4 flex flex-col items-center rounded-lg lg:rounded-2xl w-full glow-effect transform hover:scale-105 transition-transform">
                            <img src={getImagePath(name)} alt={`${name} Algorithm`} />
                            <div className="text-center text-xl sm:text-xl lg:text-2xl xl:text-3xl"> {/* Responsive text sizing */}
                                {name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );    
}

export default Home;
