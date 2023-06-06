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
} from 'react-icons/md';
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
        <div className='rounded bg-white p-2 mt-4'>
          <p className='text-center text-lg leading-6 font-bold'>
            Sign up to HomeGrid
          </p>
          <form onSubmit={onSubmit} className='mt-6'>
            <div className='input-container'>
              <MdBadge className='input-icon' />
              <input
                type='text'
                placeholder='Name'
                id='name'
                value={name}
                onChange={onChange}
                className='input-self shadow mb-8 border-b-2 border-[#e47d07] bg-white h-12 w-full outline-none px-3 xl:px-5'
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
                className='input-self shadow mb-8 border-b-2 border-[#e47d07] bg-white h-12 w-full outline-none px-3 xl:px-5'
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
                className='input-self shadow border-b-2 border-[#e47d07] bg-white h-12 w-full outline-none px-3 xl:px-5'
              />
              <MdVisibility
                className='show-icon cursor-pointer'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <div className='mt-6 flex justify-center items-center rounded bg-white pl-2 inherit xl:justify-start'>
              <button className='flex justify-between items-center w-[50%] p-2 border-2 rounded-full border-[#e47d07] xl:ml-3'>
                <MdArrowCircleRight
                  style={{
                    width: '30px',
                    height: '30px',
                    color: '#e47d07',
                  }}
                />
                <span>Sign Up</span>
              </button>
            </div>
          </form>

          <OAuth />
        </div>

        <Link to='/sign-in' className='flex flex-col items-center mt-8'>
          <p className='text-md'>Already have an account?</p>
          <p className='text-md text-[#e47d07]'>Sign In</p>
        </Link>
      </div>
    </>
  );
};

export default SignUp;
