import React, { useState, useEffect, useRef } from 'react';

function BubbleSort() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // 10% of the original volume
    gainNode.connect(audioCtx.destination);

    useEffect(() => {
        audioCtx.resume();
    }, []);

    const activeOscillators = useRef([]);

    const stopAllOscillators = () => {
        activeOscillators.current.forEach(osc => osc.stop());
        activeOscillators.current = [];
    };

    useEffect(() => {
        return () => stopAllOscillators();  // Cleanup function
    }, []);

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

    const playTone = (value) => {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        const frequency = 200 + (1800 * (value / (state.numItems - 1)));
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillator.connect(gainNode);
        oscillator.start();
        activeOscillators.current.push(oscillator);
        oscillator.onended = () => {
            const index = activeOscillators.current.indexOf(oscillator);
            if (index > -1) {
                activeOscillators.current.splice(index, 1);
            }
        };
        return oscillator;
    };

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

    const bubbleSort = async () => {
        let arr = [...state.data];
        const delay = computeBaseSpeed() / state.speedMultiplier;
        stopSorting.current = false;

        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (stopSorting.current) return;

                setState(prevState => ({ ...prevState, activeIndices: [j, j + 1] }));

                const oscillator1 = playTone(arr[j]);
                const oscillator2 = playTone(arr[j + 1]);

                await new Promise(resolve => setTimeout(resolve, delay));

                setTimeout(() => {
                    oscillator1.stop();
                    oscillator2.stop();
                }, delay / 2);

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setState(prevState => ({ ...prevState, data: arr }));
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        highlightAllBarsSequentially();
    };

    const handleRandomize = () => {
        stopSorting.current = true;
        stopAllOscillators();
        setState(prevState => ({ ...prevState, data: generateData(state.numItems), activeIndices: [], completedIndices: [] }));
    };

    const maxNumber = Math.max(...state.data);
    const isMediumScreen = window.innerWidth < 768;
    const barWidth = 100 / state.numItems;

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full space-y-4 pt-12'>
            <h1 className='text-4xl my-10'>Bubble Sort</h1>
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
                                stopSorting.current = true;
                                stopAllOscillators();
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
                                stopAllOscillators();
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

export default BubbleSort;
