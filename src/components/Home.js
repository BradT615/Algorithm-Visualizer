import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-removebg.png';

function Home() {
    const algorithmNames = [
        "BinarySearch", "LinearSearch", "QuickSort", "MergeSort",
        "InsertionSort", "SelectionSort", "BubbleSort", "HeapSort",
        "RadixSort", "BFS", "DFS", "Dijkstra",
        "AStarSearch", "ShellSort", "CountingSort", "TopologicalSort"
    ];

    return (
        <div className="h-full max-w-7xl m-auto flex flex-col justify-center items-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 p-10">
                {algorithmNames.map((name, i) => (
                    <Link key={i} to={`/${name}`}>
                        <div className="bg-customGray text-customOffWhite p-4 flex flex-col items-center w-32">
                            <img src={logo} alt="Algorithm Logo" className="mb-2" />
                            {name}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home;
