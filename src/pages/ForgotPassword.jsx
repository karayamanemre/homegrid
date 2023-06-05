import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { MdArrowRightAlt } from 'react-icons/md';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error('Could not send reset link');
    }
  };

  return (
    <div className='m-4 mb-10'>
      <header>
        <p className='text-2xl font-bold mb-2'>Forgot Password?</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            className='shadow mb-12 border-0 bg-white rounded-md h-12 w-full outline-none px-3 xl:px-5'
            onChange={onChange}
            value={email}
            id='email'
            type='email'
            placeholder='Email'
          />
          <Link className='text-[#119aa4] font-bold' to='/sign-in'>
            Sign In
          </Link>
          <div className='mt-12 flex justify-between items-center rounded bg-white pl-2 inherit xl:justify-start'>
            <p className='text-xl'>Send Reset Link</p>
            <button className='flex justify-center items-center w-12 h-12 bg-slate-100 xl:ml-3'>
              <MdArrowRightAlt
                style={{
                  width: '30px',
                  height: '30px',
                  color: '#119aa4',
                }}
              />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
