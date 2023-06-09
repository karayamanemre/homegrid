import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import {
  MdArrowCircleRight,
  MdVisibility,
  MdPerson,
  MdLock,
} from 'react-icons/md';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (userCredential.user) {
        navigate('/');
        toast.success('Signed in successfully');
      }
    } catch (error) {
      toast.error('Wrong email or password');
    }
  };

  return (
    <>
      <div className='m-4 '>
        <div className='rounded-xl bg-white p-2 mt-4 shadow-lg border-2 border-[#2a93cb] lg:w-2/4 lg:mx-auto xl:w-1/4'>
          <p className='text-center text-lg leading-6 font-bold'>
            Welcome Again!
          </p>

          <form onSubmit={onSubmit} className='mt-6'>
            <div className='input-container'>
              <MdPerson className='input-icon' />
              <input
                type='email'
                placeholder='Email'
                id='email'
                value={email}
                onChange={onChange}
                className='input-self mb-8 border-b-2 border-[#2a93cb] bg-white h-12 w-full outline-none px-3 xl:px-5'
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
                className='input-self mb-4 border-b-2 border-[#2a93cb] bg-white h-12 w-full outline-none px-3 xl:px-5'
              />
              <MdVisibility
                className='show-icon cursor-pointer'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <Link
              to='/forgot-password'
              className='flex flex-col font-bold items-end pr-1 text-[#2a93cb]'
            >
              Forgot Password?
            </Link>

            <button className='flex justify-between lg:justify-evenly items-center shadow w-[60%] mt-4 p-3 text-white rounded-full bg-[#2a93cb] mx-auto'>
              <MdArrowCircleRight className='text-2xl' />
              <span>Sign In with Email</span>
            </button>
          </form>

          <OAuth />
        </div>

        <Link to='/sign-up' className='flex flex-col items-center mt-12'>
          <p className='text-md'>Don't have an account?</p>
          <p className='text-md font-bold text-[#2a93cb]'>Sign Up</p>
        </Link>
      </div>
    </>
  );
};

export default SignIn;
