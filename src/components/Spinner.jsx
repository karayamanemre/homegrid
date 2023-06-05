import React from 'react';

const Spinner = () => {
  return (
    <div className='fixed top-0 right-0 bottom-0 left-0 bg-black z-50 flex justify-center items-center'>
      <div className='w-16 h-16 border-8 rounded-[50%] animate-spin'></div>
    </div>
  );
};

export default Spinner;
