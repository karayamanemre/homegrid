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
        <button type='button' onClick={onLogout}>
          <MdLogout className='text-[#2a93cb]' size={30} />
        </button>
      </header>

      <main>
        <div className='flex shadow justify-between items-center p-2 bg-white rounded-xl mb-4'>
          <p className='font-semibold'>Personal Information</p>
          <p
            className='cursor-pointer bg-[#2a93cb] text-white rounded-xl py-1 px-3 flex items-center'
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

        <div className='bg-white rounded-xl p-4 shadow'>
          <form className='flex flex-col'>
            <input
              type='text'
              id='name'
              className={
                !changeDetails
                  ? 'my-2 font-medium px-1 outline-none'
                  : 'my-2 font-medium bg-[#dde1f8] rounded px-1 outline-none focus-visible:ring-2 focus-visible:ring-[#2a42cb]'
              }
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              className='my-2 font-medium rounded px-1 outline-none'
              value={email}
              readOnly
            />
          </form>
        </div>
        <Link
          to='/create-listing'
          className='w-60 bg-white rounded-xl py-2 px-4 flex justify-between items-center mt-4 shadow hover:bg-gray-300'
        >
          <MdHomeFilled className='text-[#2a42cb]' size={24} />
          <p className='text-lg font-semibold'>Sell / Rent House</p>
          <MdArrowCircleRight className='text-[#2a42cb]' size={24} />
        </Link>
      </main>
    </div>
  );
};

export default Profile;
