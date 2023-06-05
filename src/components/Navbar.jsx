import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdLocalOffer, MdExplore, MdPerson } from 'react-icons/md';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer className='fixed left-0 bottom-0 right-0 h-[85px] bg-white z-30 flex justify-center items-center'>
      <nav className='w-full mt-1 overflow-y-hidden'>
        <ul className='m-0 p-0 flex justify-evenly items-center'>
          <li
            className='flex flex-col items-center cursor-pointer'
            onClick={() => navigate('/')}
          >
            <MdExplore
              style={{
                width: '35px',
                height: '35px',
                color: location.pathname === '/' ? '#e47d07' : '#000',
              }}
            />
            <p
              className='text-sm font-semibold'
              style={{
                textDecoration:
                  location.pathname === '/' ? 'underline' : 'none',
              }}
            >
              Explore
            </p>
          </li>
          <li
            className='flex flex-col items-center cursor-pointer'
            onClick={() => navigate('/offers')}
          >
            <MdLocalOffer
              style={{
                width: '35px',
                height: '35px',
                color: location.pathname === '/offers' ? '#ABBF24' : '#000',
              }}
            />
            <p
              className='text-sm font-semibold'
              style={{
                textDecoration:
                  location.pathname === '/offers' ? 'underline' : 'none',
              }}
            >
              Offer
            </p>
          </li>
          <li
            className='flex flex-col items-center cursor-pointer'
            onClick={() => navigate('/profile')}
          >
            <MdPerson
              style={{
                width: '35px',
                height: '35px',
                color: location.pathname === '/profile' ? '#119aa4' : '#000',
              }}
            />
            <p
              className='text-sm font-semibold'
              style={{
                textDecoration:
                  location.pathname === '/profile' ? 'underline' : 'none',
              }}
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Navbar;
