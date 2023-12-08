import React, { useState, useEffect, useRef } from 'react';

function BubbleSort() {
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
        completedIndices: [],
        speedMultiplier: 1
    });

    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef(null);
    const stopSorting = useRef(true);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const computeBaseSpeed = () => 1000 / state.numItems;
    const delay = computeBaseSpeed() / state.speedMultiplier;

    useEffect(() => {
        stopSorting.current = true;
        setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [], data: generateData(state.numItems) }));
    }, [state.numItems]);

    const highlightAllBarsSequentially = async (totalTime = 1000) => {
        const numBars = state.data.length;
        const delay = totalTime / numBars;
    
        setState(prevState => ({ ...prevState, activeIndices: []}));
    
        for (let i = 0; i < numBars; i++) {
            if (stopSorting.current) return;
    
            setState(prevState => ({ ...prevState, completedIndices: [...prevState.completedIndices, i] }));
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    const bubbleSort = async () => {
        if(!stopSorting.current) {
            await new Promise(resolve => setTimeout(resolve, delay));
            stopSorting.current = true;
            setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: []}));
            return;
        }

        let arr = [...state.data];
        stopSorting.current = false;

        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (stopSorting.current) return;

                setState(prevState => ({ ...prevState, activeIndices: [j, j + 1] }));
                await new Promise(resolve => setTimeout(resolve, delay));

                if (stopSorting.current) return;
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setState(prevState => ({ ...prevState, data: arr }));
                    await new Promise(resolve => setTimeout(resolve, delay));
                    if (stopSorting.current) return;
                }
            }
        }
        highlightAllBarsSequentially();
    };

    const handleRandomize = async () => {
        stopSorting.current = true;
    
        await new Promise(resolve => setTimeout(resolve, 2*computeBaseSpeed()));

        setState(prevState => ({
            ...prevState,
            data: generateData(state.numItems),
            activeIndices: [],
            completedIndices: []
        }));
    };
    
    const maxNumber = Math.max(...state.data);
    const isMediumScreen = window.innerWidth < 768;
    const barWidth = Math.floor(containerWidth / state.numItems) - 1;

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4 pt-12 border-2'>
            <h1 className='text-4xl my-10'>Bubble Sort</h1>
            <h1 className='text-4xl'>{barWidth}</h1>
            <div ref={containerRef} className="flex justify-center items-end max-w-6xl m-auto" style={{ height: '400px', width: '100%'}}>
                {state.data.map((value, idx) => (
                    <div 
                        key={idx}
                        style={{ height: `${(value / maxNumber) * 100}%`, width: `${barWidth}px`}}
                        className={`
                            ${state.activeIndices.includes(idx) ? 'bg-customPink' : ''}
                            ${state.completedIndices.includes(idx) ? 'bg-customPurple' : ''}
                            ${!state.activeIndices.includes(idx) && !state.completedIndices.includes(idx) ? 'bg-customLightBlue' : ''}
                        `}
                    />
                ))}
            </div>
            <div className='flex flex-col-reverse sm:flex-row gap-4 w-full max-w-xl py-10'>
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
                                if (value < 5) {
                                    setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [], numItems: 5 }));
                                } else if (isMediumScreen && value > 50) {
                                    setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [], numItems: 50 }));
                                } else if (!isMediumScreen && value > 100) {
                                    setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [], numItems: 100 }));
                                } else {
                                    setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [], numItems: value }));
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
                                setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [], speedMultiplier: parseFloat(e.target.value) }));
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

export default BubbleSort;