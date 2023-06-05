import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db } from '../firebase.config';
import {
  MdArrowCircleRight,
  MdVisibility,
  MdPerson,
  MdLock,
  MdBadge,
} from 'react-icons/md';

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

      navigate('/');
    } catch (error) {}
  };

  return (
    <>
      <div className='m-3'>
        <header>
          <p className='font-bold text-2xl mb-2'>Welcome Again!</p>
        </header>

        <form onSubmit={onSubmit}>
          <div className='input-container'>
            <MdBadge className='input-icon' />
            <input
              type='text'
              placeholder='Name'
              id='name'
              value={name}
              onChange={onChange}
              className='input-self shadow mb-12 border-0 bg-white rounded-md h-12 w-full outline-none px-3 xl:px-5'
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
              className='input-self shadow mb-12 border-0 bg-white rounded-md h-12 w-full outline-none px-3 xl:px-5'
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
              className='input-self shadow mb-12 border-0 bg-white rounded-md h-12 w-full outline-none px-3 xl:px-5'
            />
            <MdVisibility
              className='show-icon cursor-pointer'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link
            to='/forgot-password'
            className='flex flex-col items-end pr-1 text-[#e47d07]'
          >
            Forgot Password?
          </Link>

          <div className='mt-12 flex justify-between items-center rounded bg-white pl-2 inherit xl:justify-start'>
            <p className='text-xl'>Sign Up</p>
            <button className='flex justify-center items-center w-12 h-12 bg-slate-100 xl:ml-3'>
              <MdArrowCircleRight
                style={{
                  width: '30px',
                  height: '30px',
                  color: '#e47d07',
                }}
              />
            </button>
          </div>
        </form>

        <Link to='/sign-in' className='flex flex-col items-center mt-12'>
          <p className='text-md'>Already have an account?</p>
          <p className='text-md text-[#e47d07]'>Sign In</p>
        </Link>
      </div>
    </>
  );
};

export default SignUp;
