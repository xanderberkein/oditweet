import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Input = ({ onSend }) => {
  const [inputText, setInputText] = useState('');

  const onClick = () => {
    if (inputText) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto max-w-xl">
      <label className="block text-left">
        <textarea
          className="form-textarea mt-1 p-4 rounded-lg block w-full shadow-sm bg-white"
          rows="3"
          placeholder="What's on your mind?"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />
      </label>
      <button
        className="mt-2 mb-4 p-2 pl-5 pr-5 bg-indigo-900 text-gray-100 text-lg rounded-lg place-self-end"
        onClick={onClick}
      >
        Send
      </button>
    </div>
  );
};

Input.propTypes = {};

export default Input;
