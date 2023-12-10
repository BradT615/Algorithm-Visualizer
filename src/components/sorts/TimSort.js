import React, { useState, useEffect, useRef } from 'react';

function TimSort() {
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

    const computeBaseSpeed = () => 2000 / state.numItems;
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

    // TimSort Implementation
    const MIN_RUN = Math.floor(state.numItems / 4);


    const insertionSort = async (arr, left, right) => {
        for (let i = left + 1; i <= right; i++) {
            const key = arr[i];
            let j = i - 1;
    
            while (j >= left && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
    
                // Update active and moving indices
                if (stopSorting.current) return;
                setState(prevState => ({...prevState,  data: [...arr],  activeIndices: [i, j + 1]}));
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            arr[j + 1] = key;
    
            // Final update after insertion
            if (stopSorting.current) return;
            setState(prevState => ({...prevState, data: [...arr], activeIndices: [i], movingIndices: []}));
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };
    

    const merge = async (arr, l, m, r) => {
        if (r <= l || m < l || m > r) {
            console.error(`Invalid indices: l=${l}, m=${m}, r=${r}`);
            return;
        }
        const len1 = Math.max(0, m - l + 1);
        const len2 = Math.max(0, r - m);
        let left = new Array(len1), right = new Array(len2);
        for (let x = 0; x < len1; x++) left[x] = arr[l + x];
        for (let x = 0; x < len2; x++) right[x] = arr[m + 1 + x];

        let i = 0, j = 0, k = l;

        while (i < len1 && j < len2) {
            if (left[i] <= right[j]) {
                arr[k] = left[i];
                i++;
            } else {
                arr[k] = right[j];
                j++;
            }
            k++;
            if (stopSorting.current) return;
            setState(prevState => ({...prevState,  data: [...arr],  activeIndices: [k], movingIndices: [l + i, m + 1 + j]}));
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        while (i < len1) {
            arr[k] = left[i];
            k++;
            i++;
            if (stopSorting.current) return;
            setState(prevState => ({...prevState, data: [...arr], activeIndices: [k]}));
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        while (j < len2) {
            arr[k] = right[j];
            k++;
            j++;
            if (stopSorting.current) return;
            setState(prevState => ({...prevState, data: [...arr], activeIndices: [k]}));
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    const timSort = async (arr) => {
        const n = arr.length;

        for (let i = 0; i < n; i += MIN_RUN) {
            if (stopSorting.current) return;
            await insertionSort(arr, i, Math.min(i + MIN_RUN - 1, n - 1));
        }

        for (let size = MIN_RUN; size < n; size = 2 * size) {
            for (let left = 0; left < n - size; left += 2 * size) {
                const mid = left + size - 1;
                const right = Math.min((left + 2 * size - 1), (n - 1));
                if (stopSorting.current) return;
                await merge(arr, left, mid, right);
            }
        }
    };

    const startTimSort = async () => {
        if(!stopSorting.current) {
            await new Promise(resolve => setTimeout(resolve, delay));
            stopSorting.current = true;
            setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: []}));
            return;
        }

        stopSorting.current = false;
        let arr = [...state.data];
        await timSort(arr);
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
            <h1 className='text-4xl sm:text-6xl my-16 sm:my-8 sm:mb-16'>Tim Sort</h1>
            <div className="flex items-end max-w-4xl" style={{ height: '400px', width: '90%', gap: '1px' }}>
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
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={startTimSort}>Sort</button>
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

export default TimSort;
