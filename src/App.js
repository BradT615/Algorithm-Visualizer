import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AlgorithmComponents from './components/AlgorithmMapping';

function App() {
    useEffect(() => {
        document.title = "Algorithm Visualizer";
        // Add theme class to html element
        document.documentElement.classList.add('theme-custom');
    }, []);

    return (
        <Router>
            <Navbar /> 
            <div className="flex flex-col justify-center items-center h-full w-full bg-background text-foreground">
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
        </Router>
    );
}

export default App;