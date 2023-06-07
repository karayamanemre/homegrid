import React from 'react';
import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/sellCategoryImage.jpg';
import { MdExplore } from 'react-icons/md';

const Explore = () => {
  return (
    <div className='m-4 mb-10'>
      <header className='flex shadow justify-between items-center mb-4 bg-white p-2 rounded-xl'>
        <p className='text-2xl font-semibold'>Explore</p>
        <MdExplore className='text-[#2a93cb]' size={30} />
      </header>
      <main>
        <div className='flex shadow justify-between items-center p-2 bg-white rounded-xl mb-4'>
          <p>Categories</p>
        </div>
        <div className='flex justify-between'>
          <Link className='w-[48%]' to='/category/rent'>
            <img
              className='min-h-[115px] h-[15vh] shadow w-full rounded-xl object-cover my-0 mx-auto'
              src={rentCategoryImage}
              alt='Rentals'
            />
            <p className='font-bold text-left mt-1'>For Rent</p>
          </Link>
          <Link className='w-[48%]' to='/category/sale'>
            <img
              className='min-h-[115px] h-[15vh] shadow w-full rounded-xl object-cover my-0 mx-auto'
              src={sellCategoryImage}
              alt='For Sale'
            />
            <p className='font-bold text-left mt-1'>For Sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Explore;
