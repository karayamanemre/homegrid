import React from 'react';
import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/sellCategoryImage.jpg';
import { MdExplore } from 'react-icons/md';
import Slider from '../components/Slider';

const Explore = () => {
  return (
    <div className='m-4 mb-32'>
      <header className='flex shadow justify-between items-center mb-2 bg-white p-2 rounded-xl'>
        <p className='text-2xl font-semibold'>Explore</p>
        <MdExplore className='text-[#2a93cb]' size={30} />
      </header>
      <main>
        <Slider />
        <div>
          <p className='font-bold mb-2 text-lg lg:text-center bg-white p-2 rounded shadow lg:w-3/4 lg:mx-auto'>
            Categories
          </p>
        </div>
        <div className='flex justify-between lg:w-3/4 lg:mx-auto'>
          <Link className='w-[48%]' to='/category/rent'>
            <img
              className='min-h-[115px] h-[25vh] shadow w-full rounded-xl object-cover my-0 mx-auto lg:h-[160px]'
              src={rentCategoryImage}
              alt='Rentals'
            />
            <p className='font-bold text-left mt-1'>For Rent</p>
          </Link>
          <Link className='w-[48%]' to='/category/sale'>
            <img
              className='min-h-[115px] h-[25vh] shadow w-full rounded-xl object-cover my-0 mx-auto lg:h-[160px]'
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
