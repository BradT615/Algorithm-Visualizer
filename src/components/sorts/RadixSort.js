import React, { useState, useEffect, useRef } from 'react';

function RadixSort() {
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
        numItems: 25,
        data: generateData(25),
        activeIndices: [],
        movingIndices: [],
        completedIndices: [],
        speedMultiplier: 1
    });

    const computeBaseSpeed = () => 1000 / state.numItems;
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

    const getMax = (arr, n) => {
        let max = arr[0];
        for (let i = 1; i < n; i++)
            if (arr[i] > max)
                max = arr[i];
        return max;
    };

    const countSort = async (arr, n, exp) => {
        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);
    
        for (let i = 0; i < n; i++)
            count[Math.floor(arr[i] / exp) % 10]++;
    
        for (let i = 1; i < 10; i++)
            count[i] += count[i - 1];
    
        for (let i = n - 1; i >= 0; i--) {
            if (stopSorting.current) return;
    
            // Highlight the moving indices
            setState(prevState => ({ ...prevState, movingIndices: [i] }));
            await new Promise(resolve => setTimeout(resolve, delay));
            if (stopSorting.current) return;
    
            output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
            count[Math.floor(arr[i] / exp) % 10]--;
        }
    
        for (let i = 0; i < n; i++) {
            if (stopSorting.current) return;
            arr[i] = output[i];
            setState(prevState => ({ ...prevState, data: [...arr], activeIndices: [i], movingIndices: [] }));
            await new Promise(resolve => setTimeout(resolve, delay));
            if (stopSorting.current) return;
        }
    };
    
    const radixSort = async (arr) => {
        const n = arr.length;
        const m = getMax(arr, n);
    
        for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
            await countSort(arr, n, exp);
            // Reset the movingIndices after each pass
            setState(prevState => ({ ...prevState, movingIndices: [] }));
        }
    };
    

    const startRadixSort = async () => {
        if(!stopSorting.current) {
            await new Promise(resolve => setTimeout(resolve, delay));
            stopSorting.current = true;
            setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: []}));
            return;
        }

        stopSorting.current = false;
        let arr = [...state.data];
        await radixSort(arr);
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
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4 pt-12'>
            <h1 className='text-2xl lg:text-6xl pt-20 lg:pb-20'>Radix Sort</h1>
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
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={startRadixSort}>Sort</button>
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
                                if (value < 5) {
                                    setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: [], numItems: 5 }));
                                } else if (isMediumScreen && value > 50) {
                                    setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: [], numItems: 50 }));
                                } else if (isLargeScreen && value > 100) {
                                    setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: [], numItems: 100 }));
                                } else if (!isLargeScreen && value > 200) {
                                    setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: [], numItems: 200 }));
                                } else {
                                    setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: [], numItems: value }));
                                }
                            }}                            
                            className="px-2 py-1 border rounded w-24"
                            placeholder="Number of items"
                        />
                    </div>
                    <div className='flex gap-2'>
                        <label className="self-center">Speed:</label>
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

export default RadixSort;
