import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);

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

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className='m-4 mb-10'>
      <header className='flex justify-between items-center mb-4'>
        <p className='text-2xl font-bold'>My Profile</p>
        <button
          className='cursor-pointer bg-[#119aa4] text-white rounded-xl py-1 px-3'
          type='button'
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <main>
        <div className='flex justify-between max-w-[500px]'>
          <p className='font-bold mb-2'>Personal Information</p>
          <p
            className='cursor-pointer font-bold text-[#119aa4]'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'edit'}
          </p>
        </div>

        <div className='bg-white rounded-xl p-4 shadow max-w-[500px]'>
          <form action=''>
            <input
              type='text'
              id='name'
              className={
                !changeDetails
                  ? 'my-2 w-full font-bold rounded px-1'
                  : 'my-2 w-full font-bold bg-[#b9b0b0] rounded px-1'
              }
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              className={
                !changeDetails
                  ? 'my-2 w-full font-bold rounded px-1'
                  : 'my-2 w-full font-bold bg-[#b9b0b0] rounded px-1'
              }
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
