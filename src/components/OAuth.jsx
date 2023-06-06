import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';

const OAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in database
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // If user does not exist, create user in database
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('Could not sign in with Google');
    }
  };

  return (
    <div className='mt-4 flex flex-col items-center'>
      <p>
        Sign {location.pathname === '/sign-up' ? 'up ' : 'in '}
        with
      </p>
      <button
        className='flex justify-center items-center p-3 mt-2 bg-white rounded-[50%] shadow-md hover:shadow-lg'
        onClick={onGoogleClick}
      >
        <FcGoogle
          style={{
            width: '30px',
            height: '30px',
          }}
        />
      </button>
    </div>
  );
};

export default OAuth;
