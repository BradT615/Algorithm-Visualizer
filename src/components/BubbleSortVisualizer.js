import React, { useState, useEffect } from 'react';

function BubbleSortVisualizer() {
    const generateRandomData = (length, min, max) => {
        let numbers = new Set();
        while (numbers.size < length) {
            numbers.add(Math.floor(Math.random() * (max - min + 1) + min));
        }
        return [...numbers];
    }

    const [numItems, setNumItems] = useState(11);
    const [data, setData] = useState(generateRandomData(numItems, 1, 2 * numItems));
    const [activeIndices, setActiveIndices] = useState([]);

    useEffect(() => {
        setData(generateRandomData(numItems, 1, 2 * numItems));
    }, [numItems]);

    const bubbleSort = async () => {
        let arr = [...data];
        let n = arr.length;
        
        for (let i = 0; i < n-1; i++) {
            for (let j = 0; j < n-i-1; j++) {
                setActiveIndices([j, j+1]); // Highlight the elements being compared
                await new Promise(resolve => setTimeout(resolve, 0.1)); // Introduce a delay
    
                if (arr[j] > arr[j+1]) {
                    // swap arr[j] and arr[j+1]
                    let temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
    
                    setData([...arr]);
                    await new Promise(resolve => setTimeout(resolve, 0.1)); // Introduce a delay for swap visualization
                }
            }
        }
        setActiveIndices([]); // Clear the highlighted elements after sorting
    }

    const randomizeData = () => {
        setData(generateRandomData(numItems, 1, 2 * numItems));
    }

    const handleNumItemsChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setNumItems(value);
        }
    }

    const maxNumber = Math.max(...data);
    const barWidthPercentage = 100 / numItems;

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4'>
            <h1 className='text-4xl mb-10'>Bubble Sort</h1>
            <div className="flex justify-center items-end max-w-3xl" style={{height: '400px', width: '90%', gap: '2px'}}>
                {data.map((value, idx) => (
                    <div 
                        key={idx} 
                        style={{
                            height: `${(value / maxNumber) * 100}%`,
                            width: `${barWidthPercentage}%`
                        }}
                        className={`${activeIndices.includes(idx) ? 'bg-customPink' : 'bg-customLightBlue'}`}
                    ></div>
                ))}
            </div>
            <div className='flex'>
                <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg mr-4' onClick={bubbleSort}>Sort</button>
                <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={randomizeData}>Randomize</button>
                <input
                    type="number"
                    min="1"
                    value={numItems}
                    onChange={handleNumItemsChange}
                    className="mx-4 px-2 py-1 border rounded w-20"
                    placeholder="Number of items"
                />
            </div>
        </div>
    );
}

export default BubbleSortVisualizer;
