import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className='m-3 mb-10'>
      <header className='flex justify-between items-center'>
        <p className='text-2xl font-bold'>My Profile</p>
        <button
          className='cursor-pointer bg-[#ABBF24] text-white rounded-xl py-1 px-3'
          type='button'
          onClick={onLogout}
        >
          Logout
        </button>
      </header>
    </div>
  );
};

export default Profile;
