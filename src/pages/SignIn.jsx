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
      <div className='m-4'>
        <header>
          <p className='font-bold text-2xl mb-2'>Welcome Again!</p>
        </header>

        <form onSubmit={onSubmit}>
          <div className='input-container'>
            <MdPerson className='input-icon' />
            <input
              type='email'
              placeholder='Email'
              id='email'
              value={email}
              onChange={onChange}
              className='input-self shadow mb-8 border-0 bg-white rounded-md h-12 w-full outline-none px-3 xl:px-5'
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
              className='input-self shadow mb-4 border-0 bg-white rounded-md h-12 w-full outline-none px-3 xl:px-5'
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

          <div className='mt-6 flex justify-between items-center rounded bg-white pl-2 inherit xl:justify-start'>
            <p className='text-xl'>Sign In</p>
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

        <OAuth />

        <Link to='/sign-up' className='flex flex-col items-center mt-12'>
          <p className='text-md'>Don't have an account?</p>
          <p className='text-md text-[#e47d07]'>Sign Up</p>
        </Link>
      </div>
    </>
  );
};

export default SignIn;
