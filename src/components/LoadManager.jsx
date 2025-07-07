import React from 'react';
import { Triangle } from 'react-loader-spinner';

const LoadManager = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <Triangle
          height="80"
          width="80"
          color="#4a90e2"
          ariaLabel="loading"
          wrapperStyle={{}}
        />
        <p className="loading-text">Loading…</p>
      </div>
    </div>
  );
};

export default LoadManager;
