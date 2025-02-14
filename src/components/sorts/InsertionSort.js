import React, { useState, useEffect, useRef } from 'react';
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"

function InsertionSort() {
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

    const computeBaseSpeed = () => 1000 / state.numItems;
    const delay = computeBaseSpeed() / state.speedMultiplier;
    const stopSorting = useRef(true);

    useEffect(() => {
        stopSorting.current = true;
        setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [], data: generateData(state.numItems) }));
    }, [state.numItems]);

    const highlightAllBarsSequentially = async (totalTime = 1000) => {
        const numBars = state.data.length;
        const delay = totalTime / numBars;

        setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [] }));

        for (let i = 0; i < numBars; i++) {
            if (stopSorting.current) return;

            setState(prevState => ({ ...prevState, completedIndices: [...prevState.completedIndices, i] }));
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };  

    const insertionSort = async () => {
        if(!stopSorting.current) {
            await new Promise(resolve => setTimeout(resolve, delay));
            stopSorting.current = true;
            setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: []}));
            return;
        }

        let arr = [...state.data];
        stopSorting.current = false;

        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;

            setState(prevState => ({ ...prevState, activeIndices: [i] }));
            await new Promise(resolve => setTimeout(resolve, delay));

            while (j >= 0 && arr[j] > key) {
                if (stopSorting.current) return;

                setState(prevState => ({ ...prevState, activeIndices: [j, i] }));
                await new Promise(resolve => setTimeout(resolve, delay));

                arr[j + 1] = arr[j];
                j = j - 1;

                if (stopSorting.current) return;
                setState(prevState => ({ ...prevState, data: arr }));
                await new Promise(resolve => setTimeout(resolve, delay));
                if (stopSorting.current) return;
            }
            arr[j + 1] = key;
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
    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center border-white w-full space-y-6 p-4 mt-20 lg:mt-24 relative'>
            <div className='fixed top-16 lg:top-20 left-0 right-0 h-8 lg:h-8 w-full bg-gradient-to-b from-background to-transparent' />
            <h1 className='text-3xl lg:text-6xl font-bold mb-8'>Insertion Sort</h1>
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
                                    ${!state.activeIndices.includes(idx) && !state.completedIndices.includes(idx) ? 'bg-input' : ''}
                                `}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-xl'>
                <div className='flex flex-col sm:flex-row gap-4 w-full'>
                    <Button onClick={insertionSort} className="w-full sm:w-auto">Sort</Button>
                    <Button onClick={handleRandomize} variant="outline" className="w-full sm:w-auto">Randomize</Button>
                </div>
                <div className='flex justify-around gap-4 w-full'>
                    <div className='flex items-center gap-2'>
                        <label className="text-sm font-medium">n =</label>
                        <Input
                            type="number"
                            min="5"
                            max={isMediumScreen ? "50" : "100"}
                            value={state.numItems}
                            onChange={(e) => {
                                const value = Math.max(5, Math.min(parseInt(e.target.value, 10), isMediumScreen ? 50 : 100));
                                setState(prevState => ({ 
                                    ...prevState, 
                                    activeIndices: [], 
                                    completedIndices: [], 
                                    numItems: value 
                                }));
                            }}
                            className="w-20"
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

export default InsertionSort;