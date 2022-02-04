import React, { useEffect } from 'react';

const Alert = ({ type, msg, removeAlert, condition }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [condition]);
  return <p className={`alert alert-${type}`}>{msg}</p>;
};

export default Alert;