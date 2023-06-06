import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  MdLogout,
  MdEdit,
  MdCheck,
  MdArrowCircleRight,
  MdHomeFilled,
} from 'react-icons/md';

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
      <header className='flex shadow justify-between items-center mb-4 bg-white p-2 rounded-xl'>
        <p className='text-2xl font-semibold'>My Profile</p>
        <button
          className='cursor-pointer bg-[#119aa4] text-white rounded-xl py-1 px-3 flex items-center'
          type='button'
          onClick={onLogout}
        >
          <MdLogout className='mr-1' />
          Logout
        </button>
      </header>

      <main>
        <div className='flex shadow justify-between items-center max-w-[400px] p-2 bg-white rounded-xl mb-4'>
          <p>Personal Information</p>
          <p
            className='cursor-pointer font-medium text-[#119aa4] flex items-center justify-center'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? (
              <>
                <MdCheck /> <span>done</span>{' '}
              </>
            ) : (
              <>
                <MdEdit /> <span>edit</span>{' '}
              </>
            )}
          </p>
        </div>

        <div className='bg-white rounded-xl p-4 shadow max-w-[400px]'>
          <form action=''>
            <input
              type='text'
              id='name'
              className={
                !changeDetails
                  ? 'my-2 w-full font-medium px-1 border-b-2 border-[#d1f3f6] outline-none'
                  : 'my-2 w-full font-medium border-b-2 border-[#d1f3f6] bg-[#d1f3f6] rounded px-1 outline-none focus-visible:ring-2 focus-visible:ring-[#119aa4]'
              }
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              className='my-2 w-full font-medium rounded px-1 outline-none'
              value={email}
              readOnly
            />
          </form>
        </div>
        <Link
          to='/create-listing'
          className='bg-white rounded-xl py-2 px-4 flex justify-between items-center mt-4 shadow'
        >
          <MdHomeFilled className='text-[#119aa4]' size={20} />
          <p className='text-sm font-semibold'>Sell or rent your home</p>
          <MdArrowCircleRight className='text-[#119aa4]' size={20} />
        </Link>
      </main>
    </div>
  );
};

export default Profile;
