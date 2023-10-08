import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Algorithm from './components/Algorithm';

function App() {
    return (
        <Router>
            <div className='flex flex-col bg-customBlue min-h-screen text-customGray'>
                <Navbar />
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/:algorithmName" element={<Algorithm />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
