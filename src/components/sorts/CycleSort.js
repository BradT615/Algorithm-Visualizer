import React, { useState, useEffect, useRef } from 'react';
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"

function CycleSort() {
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

    const cycleSort = async (arr) => {
        for (let cycleStart = 0; cycleStart <= arr.length - 2; cycleStart++) {
            let item = arr[cycleStart];
    
            let pos = cycleStart;
            for (let i = cycleStart + 1; i < arr.length; i++) {
                if (arr[i] < item) {
                    pos++;
                }
            }
    
            if (pos === cycleStart) {
                continue;
            }
    
            while (item === arr[pos]) {
                pos += 1;
            }
    
            if (pos !== cycleStart) {
                [arr[pos], item] = [item, arr[pos]];
                setState(prevState => ({
                    ...prevState,
                    data: [...arr],
                    movingIndices: [...prevState.movingIndices, cycleStart, pos]
                }));
                await new Promise(resolve => setTimeout(resolve, delay));
                if (stopSorting.current) return;
            }
    
            while (pos !== cycleStart) {
                pos = cycleStart;
    
                for (let i = cycleStart + 1; i < arr.length; i++) {
                    if (arr[i] < item) {
                        pos += 1;
                    }
                }
    
                while (item === arr[pos]) {
                    pos += 1;
                }
    
                if (item !== arr[pos]) {
                    [arr[pos], item] = [item, arr[pos]];
                    setState(prevState => ({
                        ...prevState,
                        data: [...arr],
                        activeIndices: [...prevState.activeIndices, cycleStart, pos]
                    }));
                    await new Promise(resolve => setTimeout(resolve, delay));
                    if (stopSorting.current) return;
                    setState(prevState => ({ ...prevState, activeIndices: [] }));
                }
            }
        }
    };
    
    const startCycleSort = async () => {
        if (!stopSorting.current) {
            await new Promise(resolve => setTimeout(resolve, delay));
            stopSorting.current = true;
            setState(prevState => ({ ...prevState, activeIndices: [], movingIndices: [], completedIndices: [] }));
            return;
        }
    
        stopSorting.current = false;
        let arr = [...state.data];
        await cycleSort(arr);
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

    const maxNumber = initialMaxNumber.current;
    const isMediumScreen = window.innerWidth < 768;
    const isLargeScreen = window.innerWidth < 1280;
    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center w-full h-screen space-y-6 p-4'>
            <h1 className='text-3xl lg:text-6xl font-bold mb-8'>Cycle Sort</h1>
            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <div className="flex items-end h-[400px]" style={{ gap: '1px' }}>
                        {state.data.map((value, idx) => (
                            <div 
                                key={idx}
                                style={{ 
                                    height: `${(value / maxNumber) * 100}%`, 
                                    width: `${barWidth}%` 
                                }}
                                className={`
                                    ${state.activeIndices.includes(idx) ? 'bg-primary' : ''}
                                    ${state.completedIndices.includes(idx) ? 'bg-secondary' : ''}
                                    ${state.movingIndices.includes(idx) ? 'bg-blue-500' : ''}
                                    ${!state.activeIndices.includes(idx) && !state.completedIndices.includes(idx) && !state.movingIndices.includes(idx) ? 'bg-input' : ''}
                                `}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-2xl'>
                <div className='flex flex-col sm:flex-row gap-4 w-full'>
                    <Button onClick={startCycleSort} className="w-full sm:w-auto">Sort</Button>
                    <Button onClick={handleRandomize} variant="outline" className="w-full sm:w-auto">Randomize</Button>
                </div>
                <div className='flex flex-col sm:flex-row gap-4 w-full'>
                    <div className='flex items-center gap-2'>
                        <label className="text-sm font-medium">n =</label>
                        <Input
                            type="number"
                            min="5"
                            max={isLargeScreen ? "100" : "200"}
                            value={state.numItems}
                            onChange={(e) => {
                                const value = Math.max(5, Math.min(parseInt(e.target.value, 10), isLargeScreen ? 100 : 200));
                                setState(prevState => ({ 
                                    ...prevState, 
                                    activeIndices: [], 
                                    movingIndices: [],
                                    completedIndices: [], 
                                    numItems: value 
                                }));
                            }}
                            className="w-24"
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className="text-sm font-medium">Speed:</label>
                        <Select 
                            value={state.speedMultiplier.toString()}
                            onValueChange={(value) => {
                                stopSorting.current = true;
                                setState(prevState => ({ 
                                    ...prevState, 
                                    activeIndices: [], 
                                    movingIndices: [],
                                    completedIndices: [], 
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

export default CycleSort;