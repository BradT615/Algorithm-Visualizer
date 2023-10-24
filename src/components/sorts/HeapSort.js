import React, { useState, useEffect, useRef } from 'react';

function HeapSort() {
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

    const computeBaseSpeed = () => 4000 / state.numItems;

    const [state, setState] = useState({
        numItems: 50,
        data: generateData(50),
        activeIndices: [],
        movingIndices: [],
        completedIndices: [],
        speedMultiplier: 1
    });

    const stopSorting = useRef(false);

    const initialMaxNumber = useRef(Math.max(...state.data));

    useEffect(() => {
        stopSorting.current = true;
        const newData = generateData(state.numItems);
        setState(prevState => ({ ...prevState, data: newData }));
        initialMaxNumber.current = Math.max(...newData);
    }, [state.numItems]);

    const highlightAllBarsSequentially = async () => {
        const delay = 15;

        setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [] }));

        for (let i = 0; i < state.data.length; i++) {
            if (stopSorting.current) return;
            setState(prevState => ({ ...prevState, completedIndices: [...prevState.completedIndices, i] }));
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    const heapify = async (arr, n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2; 
        const delay = computeBaseSpeed() / state.speedMultiplier;

        if (left < n && arr[left] > arr[largest])
            largest = left;

        if (right < n && arr[right] > arr[largest])
            largest = right;

        if (largest !== i) {
            if (stopSorting.current) return;

            setState(prevState => ({
                ...prevState,
                activeIndices: [i, largest],
                movingIndices: [],
            }));

            await new Promise(resolve => setTimeout(resolve, delay));

            [arr[i], arr[largest]] = [arr[largest], arr[i]]; // swap

            setState(prevState => ({ ...prevState, data: [...arr] }));

            await new Promise(resolve => setTimeout(resolve, delay));

            await heapify(arr, n, largest);
        }
    };

    const heapSort = async (arr) => {
        const n = arr.length;
        for (let i = n / 2 - 1; i >= 0; i--)
            await heapify(arr, n, i);

        for (let i = n - 1; i > 0; i--) {
            if (stopSorting.current) return;

            [arr[0], arr[i]] = [arr[i], arr[0]]; // swap

            await heapify(arr, i, 0);
        }
    };

    const startHeapSort = async () => {
        stopSorting.current = false;
        let arr = [...state.data];
        await heapSort(arr);
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

    const handleRandomize = () => {
        stopSorting.current = true;
        const newData = generateData(state.numItems);
        setState(prevState => ({ ...prevState, data: newData, activeIndices: [], movingIndices: [], completedIndices: [] }));
        initialMaxNumber.current = Math.max(...newData);
    };

    const isMediumScreen = window.innerWidth < 768;
    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4 pt-12'>
            <h1 className='text-4xl my-10'>Heap Sort</h1>
            <div className="flex justify-center items-end max-w-4xl border-2" style={{ height: '400px', width: '90%', gap: '2px' }}>
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
            <div className='flex flex-col-reverse sm:flex-row gap-4 w-full max-w-xl pt-10'>
                <div className='flex justify-center gap-4 w-full'>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={startHeapSort}>Sort</button>
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
                                } else if (!isMediumScreen && value > 100) {
                                    setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: [], numItems: 100 }));
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

export default HeapSort;
