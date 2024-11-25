import React from 'react'
import { Triangle } from 'react-loader-spinner';

const LoadManager = () => {
    return (
        <div className="loading-container">
            <Triangle
                visible={true}
                height="100"
                width="100"
                color="#444"
                ariaLabel="triangle-loading"
            />
            <p>Loading...</p>
        </div>
    )
}

export default LoadManager
