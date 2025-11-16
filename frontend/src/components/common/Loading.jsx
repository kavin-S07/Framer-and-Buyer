import React from 'react';
import './Loading.css';

const Loading = ({ 
  message = 'Loading...', 
  size = 'medium', 
  color = 'success',
  fullPage = false,
  inline = false 
}) => {
  const getClassName = () => {
    const classes = ['loading-spinner'];
    if (size !== 'medium') classes.push(size);
    if (color !== 'success') classes.push(color);
    if (fullPage) classes.push('full-page');
    if (inline) classes.push('inline');
    return classes.join(' ');
  };

  return (
    <div className={getClassName()}>
      <div>
        <div className="spinner"></div>
        {message && (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;