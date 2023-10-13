import React, { useState, useEffect, useRef } from 'react';

function BubbleSortVisualizer() {
    const shuffleArray = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    };

    const generateData = length => {
        const numbers = Array.from({ length }, (_, i) => i + 1);
        shuffleArray(numbers);
        return numbers;
    };

    const BASE_SPEED = 100; // Base delay in milliseconds
    const [state, setState] = useState({
        numItems: 10,
        data: generateData(10),
        activeIndices: [],
        speedMultiplier: 1  // Default to 1x speed
    });

    const stopSorting = useRef(false); // Reference to control the sorting

    useEffect(() => {
        setState(prevState => ({ ...prevState, data: generateData(state.numItems) }));
    }, [state.numItems]);

    const bubbleSort = async () => {
        let arr = [...state.data];
        const delay = BASE_SPEED / state.speedMultiplier;
        stopSorting.current = false;
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (stopSorting.current) return;

                setState(prevState => ({ ...prevState, activeIndices: [j, j + 1] }));
                await new Promise(resolve => setTimeout(resolve, delay));

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setState(prevState => ({ ...prevState, data: arr }));
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        setState(prevState => ({ ...prevState, activeIndices: [] }));
    };

    const handleRandomize = () => {
        stopSorting.current = true;  // Signal to stop the sorting
        setState(prevState => ({ ...prevState, data: generateData(state.numItems), activeIndices: [] }));
    };    

    const maxNumber = Math.max(...state.data);
    const isSmallScreen = window.innerWidth < 640; // Check if screen width is less than 640px
    const barWidth = isSmallScreen ? (100 / state.numItems) / 2 : 100 / state.numItems;


    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4'>
            <h1 className='text-4xl mb-10'>Bubble Sort</h1>
            <div className="flex justify-center items-end max-w-3xl" style={{ height: '400px', width: '90%', gap: '2px' }}>
                {state.data.map((value, idx) => (
                    <div 
                        key={idx}
                        style={{ height: `${(value / maxNumber) * 100}%`, width: `${barWidth}%` }}
                        className={`${state.activeIndices.includes(idx) ? 'bg-customPink' : 'bg-customLightBlue'}`}
                    />
                ))}
            </div>
            <div className='flex flex-col-reverse sm:flex-row gap-4 w-full max-w-xl'>

                <div className='flex justify-center gap-4 w-full'>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={bubbleSort}>Sort</button>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={handleRandomize}>Randomize</button>
                </div>

                <div className='flex justify-center gap-4 w-full'>
                    <div className='flex gap-2 items-center'>
                        <label>n =</label>
                        <input
                            type="number"
                            min="1"
                            value={state.numItems}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                value > 0 && setState(prevState => ({ ...prevState, numItems: value }));
                            }}
                            className="px-2 py-1 border rounded w-20"
                            placeholder="Number of items"
                        />
                    </div>
                    
                    <div className='flex gap-2 items-center'>
                        <label>Speed:</label>
                        <select 
                            value={state.speedMultiplier}
                            onChange={e => setState(prevState => ({ ...prevState, speedMultiplier: parseFloat(e.target.value) }))}
                            className="border rounded">
                            <option value={0.25}>0.25x</option>
                            <option value={0.5}>0.5x</option>
                            <option value={1}>1x</option>
                            <option value={2}>2x</option>
                            <option value={4}>4x</option>
                            <option value={8}>8x</option>
                            <option value={16}>16x</option>
                        </select>
                    </div>
                </div>
                
                

            </div>
        </div>
    );
}

export default BubbleSortVisualizer;
