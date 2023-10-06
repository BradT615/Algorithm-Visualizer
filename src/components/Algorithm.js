import React from 'react';
import { useParams } from 'react-router-dom';

function Algorithm() {
    const { algorithmName } = useParams();

    const formatAlgorithmName = (name) => {
        return name.replace(/([A-Z])/g, ' $1').trim();
    };

    return (
        <div className='flex flex-col items-center w-full m-5'>
            <h1 className='text-xl p-5'>{formatAlgorithmName(algorithmName)}</h1>
            {/* Add the content or logic for each algorithm here */}
        </div>
    );
}

export default Algorithm;
