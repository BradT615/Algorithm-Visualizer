import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-removebg.png';

function Home() {
    const algorithmNames = [
        "BubbleSort", "CocktailSort", "QuickSort", "CombSort",
        "InsertionSort", "ShellSort", "GnomeSort", "BitonicSort",
        "SelectionSort", "HeapSort","MergeSort", "TimSort",
        "CycleSort", "OddEvenSort", "RadixSort", "BogoSort"
    ];    

    return (
        <div className="h-full max-w-7xl m-auto flex flex-col justify-center items-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 mt-14 sm:mt-20 md:mt-24 p-4 md:p-10 max-sm:w-full">
                {algorithmNames.map((name, i) => (
                    <Link key={i} to={`/${name}`}>
                        <div className="bg-customBlue text-customOffWhite text-2xl m-auto max-w-[350px] sm:max-w-[200px] p-4 flex justify-center sm:flex-col items-center rounded-lg sm:rounded-xl md:rounded-2xl glow-effect transform hover:scale-105 transition-transform prevent-select">
                            <img src={logo} alt="Algorithm Logo" className="p-1 md:p-6 w-20 sm:w-full hidden sm:block" />
                            <div className="text-center text-2xl sm:text-xl lg:text-2xl">
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