import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './index.css';
import AlgorithmComponents from './components/AlgorithmMapping';

function App() {
    useEffect(() => {
        document.title = "Algorithm Visualizer";
    }, []);

    return (
        <Router>
            <div className='grid grid-rows-[auto,1fr] bg-customDarkBlue min-h-screen text-customGray'>
                <Navbar />
                <div className="flex flex-col justify-center items-center h-full w-full">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {Object.keys(AlgorithmComponents).map(algoName => (
                            <Route 
                                key={algoName} 
                                path={`/${algoName}`} 
                                element={React.createElement(AlgorithmComponents[algoName])} 
                            />
                        ))}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
