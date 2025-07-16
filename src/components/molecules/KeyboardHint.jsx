import React from "react";

const KeyboardHint = ({ keys, description }) => {
  return (
    <div className="flex items-center text-xs text-gray-500">
      <span className="mr-2">{description}</span>
      {keys.map((key, index) => (
        <span key={index} className="keyboard-hint">
          {key}
        </span>
      ))}
    </div>
  );
};

export default KeyboardHint;