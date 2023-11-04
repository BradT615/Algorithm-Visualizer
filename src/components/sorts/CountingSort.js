import React, { useState, useEffect, useRef } from 'react';

function CountingSort() {
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

    const countingSort = async (arr) => {
        const max = Math.max(...arr);
        const count = Array(max + 1).fill(0);
        const delay = computeBaseSpeed() / state.speedMultiplier;

        // Counting Phase with highlighting
        for (let i = 0; i < arr.length; i++) {
            const num = arr[i];
            count[num]++;
            setState(prevState => ({ ...prevState, activeIndices: [i] }));
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Rebuilding Phase with highlighting
        let index = 0;
        for (let i = 0; i <= max; i++) {
            while (count[i]-- > 0) {
                if (stopSorting.current) return;
                
                setState(prevState => ({ ...prevState, activeIndices: [index] }));
                await new Promise(resolve => setTimeout(resolve, delay));

                arr[index++] = i;
                setState(prevState => ({ ...prevState, data: [...arr] }));
            }
        }
    };

    const startCountingSort = async () => {
        stopSorting.current = false;
        let arr = [...state.data];
        await countingSort(arr);
        setState(prevState => ({ 
            ...prevState, 
            data: arr, 
            movingIndices: [],
            activeIndices: []
        }));
    };

    const handleRandomize = () => {
        stopSorting.current = true;
        const newData = generateData(state.numItems);
        setState(prevState => ({ ...prevState, data: newData, activeIndices: [], movingIndices: [], completedIndices: [] }));
        initialMaxNumber.current = Math.max(...newData);
    };

    const isMediumScreen = window.innerWidth < 768;
    const isLargeScreen = window.innerWidth < 1280;
    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4 pt-12'>
            <h1 className='text-4xl my-10'>Counting Sort</h1>
            <div className="flex items-end max-w-6xl" style={{ height: '400px', width: '90%', gap: '1px' }}>
                {state.data.map((value, idx) => (
                    <div 
                        key={idx}
                        style={{ height: `${(value / initialMaxNumber.current) * 100}%`, width: `${barWidth}%` }}
                        className={`
                            ${state.activeIndices.includes(idx) ? 'bg-customPink' : ''}
                            ${!state.activeIndices.includes(idx) && !state.completedIndices.includes(idx) && !state.movingIndices.includes(idx) ? 'bg-customLightBlue' : ''}
                        `}
                    />
                ))}
            </div>
            <div className='flex flex-col-reverse sm:flex-row gap-4 w-full max-w-xl pt-10'>
                <div className='flex justify-center gap-4 w-full'>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={startCountingSort}>Sort</button>
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
                                    setState(prevState => ({ ...prevState, numItems: 5 }));
                                } else if (isMediumScreen && value > 50) {
                                    setState(prevState => ({ ...prevState, numItems: 50 }));
                                } else if (isLargeScreen && value > 100) {
                                    setState(prevState => ({ ...prevState, numItems: 100 }));
                                } else if (!isLargeScreen && value > 200) {
                                    setState(prevState => ({ ...prevState, numItems: 200 }));
                                } else {
                                    setState(prevState => ({ ...prevState, numItems: value }));
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

export default CountingSort;