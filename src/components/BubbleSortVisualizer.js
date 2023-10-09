import React, { useState } from 'react';

function BubbleSortVisualizer() {
    const [data, setData] = useState([5, 2, 9, 1, 5, 6, 1, 2, 4, 7, 8]);
    const [activeIndices, setActiveIndices] = useState([]); // To highlight the elements being compared

    const bubbleSort = async () => {
        let arr = [...data];
        let n = arr.length;
        
        for (let i = 0; i < n-1; i++) {
            for (let j = 0; j < n-i-1; j++) {
                setActiveIndices([j, j+1]); // Highlight the elements being compared
                await new Promise(resolve => setTimeout(resolve, 200)); // Introduce a delay

                if (arr[j] > arr[j+1]) {
                    // swap arr[j] and arr[j+1]
                    let temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;

                    setData([...arr]);
                    await new Promise(resolve => setTimeout(resolve, 200)); // Introduce a delay for swap visualization
                }
            }
        }
        setActiveIndices([]); // Clear the highlighted elements after sorting
    }

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4'>
            <h1 className='text-4xl mb-10'>Bubble Sort</h1>
            <div className="flex justify-center items-end space-x-2">
                {data.map((value, idx) => (
                    <div 
                        key={idx} 
                        style={{height: `${value * 30}px`}} // Scale the height based on value
                        className={`p-2 ${activeIndices.includes(idx) ? 'bg-red-500' : 'bg-blue-500'}`}
                    >
                        
                    </div>
                ))}
            </div>
            <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={bubbleSort}>Sort</button>
        </div>
    );
}

export default BubbleSortVisualizer;
