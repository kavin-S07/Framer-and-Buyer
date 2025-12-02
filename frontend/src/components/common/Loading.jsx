import React from 'react';
import './Loading.css';

const Loader = ({
  size = 50,
  color = '#25b09b',
  thickness = 8,
  speed = '1s',
  message = '',
  className = '',
  style = {}
}) => {
  const loaderStyle = {
    '--loader-size': `${size}px`,
    '--loader-color': color,
    '--loader-thickness': `${thickness}px`,
    '--loader-speed': speed,
    width: size,
    height: size,
    ...style
  };

  return (
    <div className={`loader-wrapper ${className}`}>
      <div className="loader-content">
        <div
          className="loader"
          style={loaderStyle}
          aria-label="Loading"
          role="status"
        />
        {message && <p className="loader-message">{message}</p>}
      </div>
    </div>
  );
};

// Small version
export const SmallLoader = (props) => (
  <Loader size={30} thickness={6} {...props} />
);

// Large version
export const LargeLoader = (props) => (
  <Loader size={80} thickness={10} {...props} />
);

// Full page loader with non-spinning text
export const FullPageLoader = ({ message = 'Loading...' }) => (
  <div className="full-page-loader">
    <div className="full-page-content">
      <div className="loader" />
      {message && <p className="full-page-message">{message}</p>}
    </div>
  </div>
);

export default Loader;