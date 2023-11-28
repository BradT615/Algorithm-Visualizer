import React, { useState, useEffect, useRef } from 'react';

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

    const cycleSort = async () => {
        if (!stopSorting.current) {
            await new Promise(resolve => setTimeout(resolve, delay));
            stopSorting.current = true;
            setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: [] }));
            return;
        }

        let arr = [...state.data];
        stopSorting.current = false;

        for (let cycleStart = 0; cycleStart < arr.length - 1; cycleStart++) {
            let item = arr[cycleStart];
            let pos = cycleStart;
            for (let i = cycleStart + 1; i < arr.length; i++) {
                if (arr[i] < item) {
                    pos++;
                }
            }

            if (pos === cycleStart) continue;

            while (item === arr[pos]) {
                pos += 1;
            }

            if (pos !== cycleStart) {
                [arr[pos], item] = [item, arr[pos]];
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
                }

                if (stopSorting.current) return;

                setState(prevState => ({ ...prevState, data: arr, activeIndices: [pos, cycleStart] }));
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            setState(prevState => ({ ...prevState, completedIndices: [...prevState.completedIndices, cycleStart] }));
        }

        setState(prevState => ({ ...prevState, activeIndices: [], completedIndices: arr.map((_, index) => index) }));
    };

    const handleRandomize = async () => {
        stopSorting.current = true;
        await new Promise(resolve => setTimeout(resolve, 2 * computeBaseSpeed()));
        setState(prevState => ({
            ...prevState,
            data: generateData(state.numItems),
            activeIndices: [],
            completedIndices: []
        }));
    };

    const maxNumber = Math.max(...state.data);
    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4 pt-12'>
            <h1 className='text-4xl my-10'>Cycle Sort</h1>
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
            <div className='flex flex-col-reverse sm:flex-row gap-4 w-full max-w-xl py-10'>
                <div className='flex justify-center gap-4 w-full'>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={cycleSort}>Sort</button>
                    <button className='px-4 py-1 text-2xl bg-customLightBlue rounded-lg' onClick={handleRandomize}>Randomize</button>
                </div>
            </div>
        </div>
    );
}

export default CycleSort;
