import React, { useState, useEffect, useRef } from 'react';

function MergeSort() {
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

    const [state, setState] = useState({
        numItems: 32,
        data: generateData(32),
        activeIndices: [],
        movingIndices: [],
        completedIndices: [],
        speedMultiplier: 1
    });

    const computeBaseSpeed = () => 3000 / state.numItems;
    const delay = computeBaseSpeed() / state.speedMultiplier;
    const stopSorting = useRef(true);
    const initialMaxNumber = useRef(Math.max(...state.data));

    useEffect(() => {
        stopSorting.current = true;
        const newData = generateData(state.numItems);
        setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: [], data: newData }));
        initialMaxNumber.current = Math.max(...newData);
    }, [state.numItems]);

    const highlightAllBarsSequentially = async (totalTime = 1000) => {
        const numBars = state.data.length;
        const delay = totalTime / numBars;
    
        setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [] }));
    
        for (let i = 0; i < numBars; i++) {
            if (stopSorting.current) return;
    
            setState(prevState => ({ ...prevState, completedIndices: [...prevState.completedIndices, i] }));
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    const bitonicSort = async (arr, start, n, up) => {
        if (n > 1) {
            const m = Math.floor(n / 2);
            await bitonicSort(arr, start, m, true);
            await bitonicSort(arr, start + m, m, false);
            await bitonicMerge(arr, start, n, up);
        }
    };

    const bitonicMerge = async (arr, start, n, up) => {
        if (n > 1) {
            const m = Math.floor(n / 2);
            for (let i = start; i < start + m; i++) {
                await compareAndSwap(arr, i, i + m, up);
            }
            await bitonicMerge(arr, start, m, up);
            await bitonicMerge(arr, start + m, m, up);
        }
    };

    const compareAndSwap = async (arr, i, j, up) => {
        if (stopSorting.current) return;
        if ((arr[i] > arr[j]) === up) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            setState(prevState => ({ ...prevState, data: [...arr], activeIndices: [i, j] }));
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    const startBitonicSort = async () => {
        if (!stopSorting.current) {
            await new Promise(resolve => setTimeout(resolve, delay));
            stopSorting.current = true;
            setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [] }));
            return;
        }

        stopSorting.current = false;
        let arr = [...state.data];
        await bitonicSort(arr, 0, arr.length, true);
        if (!stopSorting.current) {
            setState(prevState => ({ 
                ...prevState, 
                data: arr, 
                movingIndices: [],
                activeIndices: []
            }));
            highlightAllBarsSequentially();
        }
    };

    const handleRandomize = async () => {
        stopSorting.current = true;
        const newData = generateData(state.numItems);
    
        await new Promise(resolve => setTimeout(resolve, 2*computeBaseSpeed()));

        setState(prevState => ({
            ...prevState,
            data: generateData(state.numItems),
            activeIndices: [],
            movingIndices: [],
            completedIndices: []
        }));
        initialMaxNumber.current = Math.max(...newData);
    };

    const isMediumScreen = window.innerWidth < 768;
    const isLargeScreen = window.innerWidth < 1280;
    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4'>
            <h1 className='text-2xl lg:text-6xl pt-20 lg:pb-20'>Bitonic Sort</h1>
            <div className="flex items-end max-w-4xl" style={{ height: '400px', minHeight: '100px', width: '90%', gap: '1px' }}>
                {state.data.map((value, idx) => (
                    <div 
                        key={idx}
                        style={{ height: `${(value / initialMaxNumber.current) * 100}%`, width: `${barWidth}%` }}
                        className={`
                            ${state.activeIndices.includes(idx) ? 'bg-customPink' : ''}
                            ${state.completedIndices.includes(idx) ? 'bg-customPurple' : ''}
                            ${state.movingIndices.includes(idx) ? 'bg-customBlue' : ''}
                            ${!state.activeIndices.includes(idx) && !state.completedIndices.includes(idx) && !state.movingIndices.includes(idx) ? 'bg-customLightBlue' : ''}
                        `}
                    />
                ))}
            </div>
            <div className='flex flex-col-reverse sm:flex-row gap-4 w-full max-w-xl py-10'>
                <div className='flex justify-center gap-4 w-full'>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={startBitonicSort}>Sort</button>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={handleRandomize}>Randomize</button>
                </div>
                <div className='flex justify-center gap-4 w-full'>
                    <div className='flex gap-2 items-center'>
                        <label className="self-center">n =</label>
                        <select 
                            value={state.numItems}
                            onChange={e => setState(prevState => ({ 
                                ...prevState, 
                                activeIndices: [], 
                                movingIndices: [], 
                                completedIndices: [], 
                                numItems: parseInt(e.target.value, 10) 
                            }))}
                            className="border rounded w-16 h-full"
                        >
                            <option value={8}>8</option>
                            <option value={16}>16</option>
                            <option value={32}>32</option>
                            <option value={64}>64</option>
                            <option value={128}>128</option>
                        </select>
                    </div>
                    <div className='flex gap-2'>
                        <label className="self-center">Speed:</label>
                        <select 
                            value={state.speedMultiplier}
                            onChange={e => setState(prevState => ({ 
                                ...prevState, 
                                speedMultiplier: parseFloat(e.target.value) 
                            }))}
                            className="border rounded"
                        >
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

export default MergeSort;
