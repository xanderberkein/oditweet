import React from 'react';
import { LibraryIcon } from '@heroicons/react/solid';

const Logo = () => {
  return (
    <div className="w-full mx-auto max-w-xl mb-12 flex items-center">
      <LibraryIcon className="h-10 w-10 text-indigo-900" />
      <div className="mx-4 text-3xl text-indigo-900">Oditweet</div>
    </div>
  );
};

export default Logo;
