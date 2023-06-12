import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { toast } from 'react-toastify';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import {
  MdArrowCircleRight,
  MdVisibility,
  MdPerson,
  MdLock,
  MdBadge,
  MdLogin,
} from 'react-icons/md';
import { FaSignUp } from 'react-icons/fa';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');
      toast.success('Signed up successfully');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <div className='m-4'>
        <div className='rounded-xl bg-white p-2 mt-4 shadow-lg border-2 border-[#2a93cb] lg:w-2/4 lg:mx-auto xl:w-1/4'>
          <p className='text-center text-xl leading-6 font-bold'>
            <MdLogin className='inline-block text-2xl mr-2' />
            Sign Up
          </p>
          <form onSubmit={onSubmit} className='mt-6 '>
            <div className='input-container'>
              <MdBadge className='input-icon' />
              <input
                type='text'
                placeholder='Name'
                id='name'
                value={name}
                onChange={onChange}
                className='input-self mb-8 border-b-2 border-[#2a93cb] bg-white h-12 w-full outline-none px-3 xl:px-5'
              />
            </div>

            <div className='input-container'>
              <MdPerson className='input-icon' />
              <input
                type='email'
                placeholder='Email'
                id='email'
                value={email}
                onChange={onChange}
                className='input-self  mb-8 border-b-2 border-[#2a93cb] bg-white h-12 w-full outline-none px-3 xl:px-5'
              />
            </div>
            <div className='input-container'>
              <MdLock className='input-icon' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                id='password'
                value={password}
                onChange={onChange}
                className='input-self border-b-2 border-[#2a93cb] bg-white h-12 w-full outline-none px-3 xl:px-5'
              />
              <MdVisibility
                className='show-icon cursor-pointer'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <button className='flex justify-between lg:justify-evenly items-center shadow w-[60%] mt-4 p-3 text-white rounded-full bg-[#2a93cb] mx-auto'>
              <MdArrowCircleRight className='text-2xl' />
              <span>Sign Up with Email</span>
            </button>
          </form>

          <OAuth />
        </div>

        <Link to='/sign-in' className='flex flex-col items-center mt-8'>
          <p className='text-md'>Already have an account?</p>
          <p className='text-md font-bold text-[#2a93cb]'>Sign In</p>
        </Link>
      </div>
    </>
  );
};

export default SignUp;
