import React, { useState, useEffect, useRef } from 'react';

function CocktailSort() {

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

    const computeBaseSpeed = () => 1000 / state.numItems;

    const [state, setState] = useState({
        numItems: 10,
        data: generateData(10),
        activeIndices: [],
        completedIndices: [],
        speedMultiplier: 1
    });

    const stopSorting = useRef(false);

    useEffect(() => {
        setState(prevState => ({ ...prevState, data: generateData(state.numItems) }));
    }, [state.numItems]);

    const highlightAllBarsSequentially = () => {
        const delay = 20;
        for (let i = 0; i < state.data.length; i++) {
            setTimeout(() => {
                setState(prevState => ({ ...prevState, completedIndices: [...prevState.completedIndices, i] }));
            }, i * delay);
        }
    };

    const cocktailSort = async () => {
        let arr = [...state.data];
        const delay = computeBaseSpeed() / state.speedMultiplier;
        stopSorting.current = false;
    
        let swapped = true;
        let start = 0;
        let end = arr.length;
    
        while (swapped) {
            swapped = false;
    
            // Forward pass:
            for (let i = start; i < end - 1; i++) {
                if (stopSorting.current) return;
                setState(prevState => ({ ...prevState, activeIndices: [i, i + 1] }));
                await new Promise(resolve => setTimeout(resolve, delay));
    
                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    setState(prevState => ({ ...prevState, data: arr }));
                    await new Promise(resolve => setTimeout(resolve, delay));
                    swapped = true;
                }
            }
    
            // If nothing moved, then the array is sorted.
            if (!swapped) break;
    
            swapped = false;
            end--;
    
            // Backward pass:
            for (let i = end - 1; i >= start; i--) {
                if (stopSorting.current) return;
                setState(prevState => ({ ...prevState, activeIndices: [i, i + 1] }));
                await new Promise(resolve => setTimeout(resolve, delay));
    
                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    setState(prevState => ({ ...prevState, data: arr }));
                    await new Promise(resolve => setTimeout(resolve, delay));
                    swapped = true;
                }
            }
    
            start++;
        }
    
        highlightAllBarsSequentially();
    };    

    const handleRandomize = () => {
        stopSorting.current = true;
        setState(prevState => ({ ...prevState, data: generateData(state.numItems), activeIndices: [], completedIndices: [] }));
    };

    const maxNumber = Math.max(...state.data);
    const isMediumScreen = window.innerWidth < 768;
    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4 pt-12'>
            <h1 className='text-4xl my-10'>Cocktail Sort</h1>
            <div className="flex justify-center items-end max-w-4xl" style={{ height: '400px', width: '90%', gap: '1px' }}>
                {state.data.map((value, idx) => (
                    <div 
                        key={idx}
                        style={{ height: `${(value / maxNumber) * 100}%`, width: `${barWidth}%` }}
                        className={`
                            ${state.activeIndices.includes(idx) ? 'bg-customPink' : ''}
                            ${state.completedIndices.includes(idx) ? 'bg-customPurple' : ''}
                            ${!state.activeIndices.includes(idx) && !state.completedIndices.includes(idx) ? 'bg-customLightBlue' : ''}
                        `}
                    />
                ))}
            </div>
            <div className='flex flex-col-reverse sm:flex-row gap-4 w-full max-w-xl pt-10'>
                <div className='flex justify-center gap-4 w-full'>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={cocktailSort}>Sort</button>
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
                                stopSorting.current = true;
                                const value = parseInt(e.target.value, 10);
                                if (value < 5) {
                                    setState(prevState => ({ ...prevState, numItems: 5 }));
                                } else if (isMediumScreen && value > 50) {
                                    setState(prevState => ({ ...prevState, numItems: 50 }));
                                } else if (!isMediumScreen && value > 100) {
                                    setState(prevState => ({ ...prevState, numItems: 100 }));
                                } else {
                                    setState(prevState => ({ ...prevState, numItems: value }));
                                }
                            }}
                            className="px-2 py-1 border rounded w-20"
                            placeholder="Number of items"
                        />
                    </div>
                    <div className='flex gap-2'>
                        <label className="self-center">Speed:</label>
                        <select 
                            value={state.speedMultiplier}
                            onChange={e => {
                                stopSorting.current = true;
                                setState(prevState => ({ ...prevState, speedMultiplier: parseFloat(e.target.value) }));
                            }}
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

export default CocktailSort;