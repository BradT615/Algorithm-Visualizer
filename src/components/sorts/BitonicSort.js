import React, { useState, useEffect, useRef } from 'react';
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"

function BitonicSort() {
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
            data: newData,
            activeIndices: [],
            movingIndices: [],
            completedIndices: []
        }));
        initialMaxNumber.current = Math.max(...newData);
    };

    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center border-white w-full space-y-6 p-4 mt-20 lg:mt-24 relative'>
            <div className='fixed top-16 lg:top-20 left-0 right-0 h-8 lg:h-8 w-full bg-gradient-to-b from-background to-transparent' />
            <h1 className='text-3xl lg:text-6xl font-bold mb-8'>Bitonic Sort</h1>
            <Card className="w-full max-w-4xl h-[400px]">
                <CardContent className="p-6">
                    <div className="flex items-ends" style={{ gap: '1px' }}>
                        {state.data.map((value, idx) => (
                            <div 
                                key={idx}
                                style={{ 
                                    height: `${(value / initialMaxNumber.current) * 100}%`, 
                                    width: `${barWidth}%` 
                                }}
                                className={`
                                    ${state.activeIndices.includes(idx) ? 'bg-primary' : ''}
                                    ${state.completedIndices.includes(idx) ? 'bg-secondary' : ''}
                                    ${state.movingIndices.includes(idx) ? 'bg-accent' : ''}
                                    ${!state.activeIndices.includes(idx) && !state.completedIndices.includes(idx) && !state.movingIndices.includes(idx) ? 'bg-input' : ''}
                                `}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-2xl'>
                <div className='flex flex-col sm:flex-row gap-4 w-full'>
                    <Button onClick={startBitonicSort} className="w-full sm:w-auto">Sort</Button>
                    <Button onClick={handleRandomize} variant="outline" className="w-full sm:w-auto">Randomize</Button>
                </div>
                <div className='flex justify-around gap-4 w-full'>
                    <div className='flex items-center gap-2'>
                        <label className="text-sm font-medium">n =</label>
                        <Select 
                            value={state.numItems.toString()}
                            onValueChange={(value) => {
                                setState(prevState => ({ 
                                    ...prevState, 
                                    activeIndices: [], 
                                    movingIndices: [], 
                                    completedIndices: [], 
                                    numItems: parseInt(value, 10) 
                                }));
                            }}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="Items" />
                            </SelectTrigger>
                            <SelectContent>
                                {[8, 16, 32, 64, 128].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className="text-sm font-medium">Speed:</label>
                        <Select 
                            value={state.speedMultiplier.toString()}
                            onValueChange={(value) => {
                                setState(prevState => ({ 
                                    ...prevState, 
                                    speedMultiplier: parseFloat(value) 
                                }));
                            }}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Speed" />
                            </SelectTrigger>
                            <SelectContent>
                                {[0.25, 0.5, 1, 2, 4, 8, 16].map((speed) => (
                                    <SelectItem key={speed} value={speed.toString()}>{speed}x</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BitonicSort;