import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const algorithmNames = [
        "BinarySearch", "LinearSearch", "QuickSort", "MergeSort",
        "InsertionSort", "SelectionSort", "BubbleSort", "HeapSort",
        "RadixSort", "BFS", "DFS", "Dijkstra",
        "AStarSearch", "ShellSort", "CountingSort", "TopologicalSort"
    ];

    return (
        <div className="flex flex-col flex-grow">
            <div className="flex-grow grid grid-cols-4 gap-4 w-full border-2">
                {/* Grid items */}
                {algorithmNames.map((name, i) => (
                    <Link key={i} to={`/${name}`}>
                        <div className="bg-gray-300 p-4">{name}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home;
