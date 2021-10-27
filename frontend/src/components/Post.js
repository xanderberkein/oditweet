import React from 'react';
import PropTypes from 'prop-types';
import { HeartIcon } from '@heroicons/react/outline';

const Post = ({ id, name, date, content, likes = 0, onLike }) => {
  return (
    <div className="w-full mx-auto m-4 rounded-lg bg-white shadow p-5 text-gray-800 max-w-xl">
      <div className="w-full flex mb-4 items-center">
        <div className="overflow-hidden rounded-full w-12 h-12">
          <img src="" alt="" />
        </div>
        <div className="flex-grow pl-3">
          <h6 className="font-bold text-md">{name}</h6>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <div className="w-full mb-4">
        <p className="text-sm">{content}</p>
      </div>
      <button className="flex items-center flex-row" onClick={() => onLike(id)}>
        <HeartIcon className="h-5 w-5 text-red-500" />
        <div className="mx-2">{likes}</div>
      </button>
    </div>
  );
};

Post.propTypes = {};

export default Post;
