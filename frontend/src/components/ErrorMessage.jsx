import React from "react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="alert alert-danger mt-3" role="alert">
      {message}
    </div>
  );
};

export default ErrorMessage; 