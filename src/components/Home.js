import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-removebg.png';

function Home() {
    const algorithmNames = [
        "BubbleSort", "CocktailSort", "QuickSort", "CombSort",
        "InsertionSort", "ShellSort", "GnomeSort", "PatienceSort",
        "SelectionSort", "HeapSort","MergeSort", "TimSort",
        "CycleSort", "BucketSort", "RadixSort", "BogoSort"
    ];    

    return (
        <div className="h-full max-w-7xl m-auto flex flex-col justify-center items-center">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-24 p-10 sm:p-12 md:p-10">
                {algorithmNames.map((name, i) => (
                    <Link key={i} to={`/${name}`}>
                        <div className="bg-customBlue text-customOffWhite text-2xl p-4 flex flex-col items-center rounded-3xl w-full glow-effect transform hover:scale-105 transition-transform">
                            <img src={logo} alt="Algorithm Logo" className=" p-6" />
                            <div className="text-center text-xl sm:text-xl lg:text-2xl xl:text-3xl">
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